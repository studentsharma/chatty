import express from 'express';
import getChatBetweenUsers from '../controllers/message.controller.js';

const router = express.Router();

router.get("/:user1/:user2", getChatBetweenUsers);

export default router;
