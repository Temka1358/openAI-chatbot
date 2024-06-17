import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

const DOMAIN = '219.94.251.92';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();
    console.log(users);
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", cause: error.message });
  }
};

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Clear old token, create token, and store token
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: DOMAIN,
      httpOnly: true,
      signed: true,
      sameSite: 'None'
    });

    const token = createToken(user._id.toString(), user.email, "7d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: DOMAIN,
      expires,
      httpOnly: true,
      signed: true,
      sameSite: 'none',
      secure: false  // Do not set secure to true since you are not using HTTPS
    });

    return res.status(201).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", cause: error.message });
  }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Not registered user" });
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Wrong password" });
    }

    // Clear old token, create token, and store token
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: DOMAIN,
      httpOnly: true,
      signed: true,
      sameSite: 'none'
    });

    const token = createToken(user._id.toString(), user.email, "7d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: DOMAIN,
      expires,
      httpOnly: true,
      signed: true,
      sameSite: 'none',
      secure: false  // Do not set secure to true since you are not using HTTPS
    });

    return res.status(200).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", cause: error.message });
  }
};

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "User not registered or token malfunction" });
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: "Permission did not match" });
    }

    return res.status(200).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", cause: error.message });
  }
};

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  console.log("User logout");
  try {
    const user = await User.findById(res.locals.jwtData.id);
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "User not registered or token malfunction" });
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).json({ message: "Permission did not match" });
    }

    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: DOMAIN,
      httpOnly: true,
      signed: true,
      sameSite: 'none'
    });

    return res.status(200).json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", cause: error.message });
  }
};
