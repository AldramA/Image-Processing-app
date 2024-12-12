import express from 'express';
import multer from 'multer';
import { verifyToken, isOwnerOrAdmin } from '../middleware/auth.middleware.js';
import { ImageService } from '../services/image.service.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { appConfig } from '../config/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: appConfig.uploadLimits.fileSize
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

// Upload image
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        const image = await ImageService.createImage({
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size
        }, req.userId);

        res.status(201).json(image);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user's images
router.get('/', verifyToken, async (req, res) => {
    try {
        const images = await ImageService.getUserImages(req.userId);
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get specific image
router.get('/:id', verifyToken, isOwnerOrAdmin, async (req, res) => {
    res.json(req.image);
});

// Transform image
router.post('/:id/transform', verifyToken, isOwnerOrAdmin, async (req, res) => {
    try {
        const transformedPath = await ImageService.transformImage(req.image, req.body.transformations);
        res.json({
            message: "Image transformed successfully",
            path: transformedPath
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete image
router.delete('/:id', verifyToken, isOwnerOrAdmin, async (req, res) => {
    try {
        const image = req.image;
        image.status = 'deleted';
        await image.save();
        
        res.json({ message: "Image deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
