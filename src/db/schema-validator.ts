import { z } from "zod";

// 👇 Strong password regex (min 8 chars, at least 1 letter, 1 number, 1 special char)
const strongPasswordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()[\]{}|\\:;"'<>,.?/~`_+=-]).{8,}$/;

export const registerUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      strongPasswordRegex,
      "Password must contain at least 1 letter, 1 number, and 1 special character"
    ),
  bio: z
    .string()
    .min(2, "Bio must be at least 2 characters")
    .max(255, "Bio cannot be longer than 255 characters")
    .default("I'm a new user!"),
  image: z
    .string()
    .url("Image must be a valid URL")
    .max(255, "Image URL cannot be longer than 255 characters")
    .default("https://example.com/avatar.jpg"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      strongPasswordRegex,
      "Password must contain at least 1 letter, 1 number, and 1 special character"
    ),
});
