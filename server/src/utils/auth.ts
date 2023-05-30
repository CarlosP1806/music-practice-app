import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../models/User';
dotenv.config();

const SECRET = process.env.SECRET;

export interface AuthenticatedRequest extends Request {
  userId?: string
};

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ err: 'no token provided' });
  }
  try {
    const { userId } = jwt.verify(
      token,
      SECRET as string
    ) as any;
    req.userId = userId;
  } catch (err) {
    return res.status(401).json({ err: 'invalid token' });
  }

  next();
}

export const signToken = ({ username, email, _id}: IUser) => {
  const payload = { userId: _id, username, email };
  return jwt.sign(payload, SECRET as string);
};

export default authMiddleware;
