import { Request } from "express";
import { UserDoc } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user: UserDoc | null;
    }
  }
}
