import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import OpenAI from "openai";
import { openaiSystemMessage } from "../config/openai-configs.js";

// Function to generate chat completion
export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;

  try {
    // Fetch user by ID from the JWT data
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    }

    // Create chat history and add new user message
    const chats = user.chat.map(({ role, content }) => ({ role, content }));
    chats.push({ content: message, role: "user" });

    // Add new user message to user chat
    user.chat.push({ content: message, role: "user" });

    // Initialize OpenAI with the API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Generate chat completion
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      //@ts-ignore
      messages: chats,
      max_tokens: 200,
    });

    const chatResponse = response.choices[0].message;
    // Add response to user chat and save
    user.chat.push(chatResponse);

    await user.save();
    // Exclude the first message (system message) from the chat array
    const userChatsExcludingSystemMessage = user.chat.slice(1);
    return res.status(200).json({ message: "OK", chats: userChatsExcludingSystemMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Function to send chat history to user
export const sendChatToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch user by ID from the JWT data
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered or token malfunction" });
    }
    // Exclude the first message (system message) from the chat array
    const userChatsExcludingSystemMessage = user.chat.slice(1);
    return res.status(200).json({ message: "OK", chats: userChatsExcludingSystemMessage });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error.message });
  }
};

// Function to delete user chat history
export const deleteUserChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch user by ID from the JWT data
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not registered or token malfunction" });
    }

    // Clear user chat history and save
    //@ts-ignore
    user.chat = [{ role: "system", content: openaiSystemMessage(user.eikenLevel) }];
    await user.save();

    return res.status(200).json({ message: "OK", chats: user.chat });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error.message });
  }
};
