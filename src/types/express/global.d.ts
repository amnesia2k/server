// types/express/index.d.ts or in a global.d.ts file
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { _id: string; role: string };
    }
  }
}
