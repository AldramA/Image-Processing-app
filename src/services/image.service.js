import sharp from 'sharp';
import db from '../models/index.js';

export class ImageService {
    static async createImage(imageData, userId) {
        return await db.Image.create({
            ...imageData,
            userId
        });
    }

    static async getUserImages(userId) {
        return await db.Image.findAll({
            where: {
                userId,
                status: 'active'
            },
            order: [['createdAt', 'DESC']]
        });
    }

    static async transformImage(image, transformations) {
        let sharpImage = sharp(image.path);

        if (transformations.resize) {
            sharpImage = sharpImage.resize(
                transformations.resize.width,
                transformations.resize.height,
                { fit: 'cover' }
            );
        }

        if (transformations.rotate) {
            sharpImage = sharpImage.rotate(transformations.rotate);
        }

        if (transformations.grayscale) {
            sharpImage = sharpImage.grayscale();
        }

        if (transformations.flip) {
            sharpImage = sharpImage.flip();
        }

        const outputPath = image.path.replace('.', '_transformed.');
        await sharpImage.toFile(outputPath);

        // Create edit record
        await db.ImageEdit.create({
            imageId: image.id,
            editedBy: image.userId,
            transformations: transformations
        });

        return outputPath;
    }
}
