import { Server } from "socket.io";
import userModel from "../models/user.model.js"
import messageModel from "../models/messages.model.js"

const socketHandler = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        // console.log('User connected:', socket.id);

        socket.on("register-user", async (username) => {
            try {
                await userModel.findOneAndUpdate(
                    { username },
                    { socketid: socket.id }
                );
                console.log(`${username} registered with socket ID ${socket.id}`);
            } catch (err) {
                console.error("Error registering user:", err.message);
            }
        });

        // Fixed: Match the client-side event structure
        socket.on('send-message', async (messageData) => {
            // console.log('Received message data:', messageData);
            
            // Extract data from the client payload
            const { content, by, to } = messageData;
            
            // Validate required fields
            if (!content || !by || !to) {
                console.error('Missing required fields:', { content, by, to });
                return;
            }

            try {
                // Find receiver
                let receiver = await userModel.findOne({ username: to });
                
                if (!receiver) {
                    console.log(`User ${to} not found in database`);
                } else {
                    let receiver_socketId = receiver.socketid;

                    if (receiver_socketId) {
                        // Send message to receiver
                        io.to(receiver_socketId).emit('receive-message', {
                            content,
                            by,
                            to
                        });
                        // console.log(`Message from ${by} to ${to}: ${content}`);
                    } else {
                        console.log(`User ${to} is not online (no socket ID)`);
                    }
                }
            } catch (err) {
                console.error("Error finding receiver:", err.message);
            }

            // Save message to database
            try {
                let thread = await messageModel.findOne({
                    $or: [
                        { from: by, to: to },
                        { from: to, to: by },
                    ],
                });

                if (!thread) {
                    thread = new messageModel({ 
                        from: by, 
                        to: to, 
                        messages: [] 
                    });
                }

                thread.messages.push({
                    content: content,
                    by: by,
                    timestamp: new Date()
                });

                await thread.save();
                // console.log(`💾 Message saved from ${by} to ${to}: ${content}`);
            } catch (err) {
                console.error("Error saving message:", err.message);
            }
        });

        // Handle user disconnection
        socket.on('disconnect', async () => {
            // console.log('User disconnected:', socket.id);
            
            // Optional: Clear socket ID from user record
            try {
                await userModel.findOneAndUpdate(
                    { socketid: socket.id },
                    { $unset: { socketid: 1 } }
                );
                // console.log(`🔌 Socket ID ${socket.id} cleared from user record`);
            } catch (err) {
                console.error("❌ Error clearing socket ID:", err.message);
            }
        });
    });

    return io;
}

export default socketHandler;
