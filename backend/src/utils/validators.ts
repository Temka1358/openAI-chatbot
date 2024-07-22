import { body, ValidationChain, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validate = (validations: ValidationChain[]) => {
  
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        break;
      }
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  };
};

export const signupValidator = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").trim().isEmail().withMessage("Email is required and must be a valid email invalid"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("eikenLevel").isInt({ min: 1, max: 5 }).withMessage("Eiken level must be between 1 and 5")
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Email is required"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const chatCompletionValidator = [
  body("message").notEmpty().withMessage("Message is required"),
]