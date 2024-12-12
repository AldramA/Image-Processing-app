import jwt from 'jsonwebtoken';
import db from '../models/index.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(403).json({ message: "No token provided!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(decoded.id);
    
    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    req.userId = decoded.id;
    req.userRole = user.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: "Require Admin Role!" });
  }
  next();
};

export const isOwnerOrAdmin = async (req, res, next) => {
  try {
    const image = await db.Image.findByPk(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: "Image not found!" });
    }

    if (req.userRole === 'admin' || image.userId === req.userId) {
      req.image = image;
      next();
    } else {
      res.status(403).json({ message: "Access denied!" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
