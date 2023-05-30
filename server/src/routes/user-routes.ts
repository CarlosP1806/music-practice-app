import express, { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import authMiddleware, { AuthenticatedRequest, signToken } from '../utils/auth';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

type UserResponse = { err: string } | { data: IUser };
type TokenResponse = { err: string } | { data: { token: string, user: IUser }};

router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response<UserResponse>) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      res.status(404).json({ err: 'cannot find current user' });
      return;
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ err: 'something went wrong' });
  } 
});

router.post('/', async (req: Request<{}, {}, IUser>, res: Response<UserResponse>) => {
  try {
    console.log(req.body);
    const user = await User.create(req.body);
    if (!user) {
      res.status(500).json({ err: "cannot create user" });
      return;
    }
    res.status(201).json({ data: user });

  } catch(error) {
    res.status(500).json({ err: 'something went wrong' });
  }
});

router.post('/login', async (req: Request<{}, {}, { username: string, password: string }>, res: Response<TokenResponse>) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(404).json({ err: 'invalid username' });
      return;
    }
    const correctPwd = req.body.password === user.password;
    if (!correctPwd) {
      res.status(401).json({ err: 'invalid password' });
    }

    const token = signToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000*60*30,
      domain: process.env.COOKIE_DOMAIN,
      sameSite: 'lax'
    });
    res.json( { data: { token, user } });

  } catch (error) {
    res.status(500).json({ err: 'something went wrong' });
  }
});

router.post('/logout', async (_: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: 'logged out' });
});

router.get('/:id', async (req: Request<{ id: string }>, res: Response<UserResponse>) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      res.status(404).json({ err: "cannot find user" });
      return;
    }
    res.status(200).json({ data: user });
  } catch(error) {
    res.status(500).json({ err: 'something went wrong' });
  }
});

export default router;
