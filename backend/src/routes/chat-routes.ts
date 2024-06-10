
import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import {validate, chatCompletionValidator} from "../utils/validators.js";
import { generateChatCompletion, sendChatToUser, deleteUserChat } from "../controllers/chat-controller.js";

const chatRouter = Router();

//protecred API
chatRouter.post('/new',validate(chatCompletionValidator), verifyToken, generateChatCompletion);

chatRouter.get('/all-chats', verifyToken, sendChatToUser);
chatRouter.delete('/delete', verifyToken, deleteUserChat);

export default chatRouter;
