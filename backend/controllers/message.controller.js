import messageModel from "../models/messages.model.js"

const getChatBetweenUsers = async (req, res) => {
    const { user1, user2 } = req.params;
    try {
        const chat = await messageModel.findOne({
            $or: [
                { from: user1, to: user2 },
                { from: user2, to: user1 },
            ],
        });

        return res.status(200).json(chat?.messages || []);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export default getChatBetweenUsers;

