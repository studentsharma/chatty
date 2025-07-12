import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import socketHandler from './sockets/socket.js';
import connectDB from "./db/connectDB.js"
import messageroute from "./routes/message.route.js" 
import userroute from "./routes/user.route.js"
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

// app.use(cors({
//   origin: [
//     "https://chat-frontend-eypj.onrender.com",
//     "http://localhost:5173"
//   ], 
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
// }));

app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);
socketHandler(server)


app.use("/main", userroute)
app.use("/messages" ,messageroute)

app.get(["/home","/signup","/"], (req,res)=>{
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
})



const PORT = process.env.PORT || 5000;
server.listen(PORT , '0.0.0.0', () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
