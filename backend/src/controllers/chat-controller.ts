import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import OpenAI, { } from "openai";


export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
    // grab chats of user
    const chats = user.chat.map(({ role, content }) => ({
      role,
      content,
    }));

    chats.push({ content: message, role: "user" });
    user.chat.push({ content: message, role: "user" });

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chats,
      max_tokens: 20,
    })

    const chatResponse = response.choices[0].message;
    console.log(chatResponse)

    user.chat.push(chatResponse);
    await user.save();
    return res.status(200).json({ chats: user.chat });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const sendChatToUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        //user token check
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
        return res
          .status(401)
          .json({ message: "User not registered or token malfunction" });
      }
      if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).json({ message: "Permission/token did not match" });
      }
  
      return res
        .status(200)
        .json({ message: "OK", chats: user.chat });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", cause: error.message });
    }
  };


  export const deleteUserChat = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        //user token check
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
        return res
          .status(401)
          .json({ message: "User not registered or token malfunction" });
      }
      if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).json({ message: "Permission/token did not match" });
      }
      // @ts-ignore
      user.chat = [];
      await user.save();
  
      return res
        .status(200)
        .json({ message: "OK", chats: user.chat });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", cause: error.message });
    }
  };