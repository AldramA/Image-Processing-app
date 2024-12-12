import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import db from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get all users with their stats
router.get('/users', [verifyToken, isAdmin], async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: { exclude: ['password'] },
      include: [{
        model: db.Image,
        as: 'images',
        attributes: ['id', 'status']
      }]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user details with their images and edit history
router.get('/users/:id', [verifyToken, isAdmin], async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: db.Image,
          as: 'images',
          include: [{
            model: db.ImageEdit,
            as: 'edits'
          }]
        },
        {
          model: db.ImageEdit,
          as: 'editsMade'
        }
      ]
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all image edits
router.get('/edits', [verifyToken, isAdmin], async (req, res) => {
  try {
    const edits = await db.ImageEdit.findAll({
      include: [
        {
          model: db.User,
          as: 'editor',
          attributes: ['id', 'username']
        },
        {
          model: db.Image,
          as: 'image',
          include: [{
            model: db.User,
            as: 'owner',
            attributes: ['id', 'username']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(edits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user status
router.patch('/users/:id/status', [verifyToken, isAdmin], async (req, res) => {
  try {
    const { status } = req.body;
    const user = await db.User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.status = status;
    await user.save();
    
    res.json({ message: "User status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user role
router.put('/users/:id/role', [verifyToken, isAdmin], async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'user' or 'admin'" });
    }

    const user = await db.User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent removing the last admin
    if (role === 'user' && user.role === 'admin') {
      const adminCount = await db.User.count({ where: { role: 'admin' } });
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot remove the last admin user" });
      }
    }

    await user.update({ role });
    
    res.json({
      message: "User role updated successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
