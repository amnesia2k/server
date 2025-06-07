import jwt from "jsonwebtoken";

// use user._id to generate token
export function generateToken(userId: string, role: string) {
  return jwt.sign({ _id: userId, role }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}
