import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { decode } from 'punycode';

const JWT_SECRET = process.env.JWT_SECRET || 'dwqdwq';

export const authenticateToken = (
  req: Request,
  res: any,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Нэвтрээгүй хэрэглэгч байна." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Токен хүчингүй байна." });
  }
};
