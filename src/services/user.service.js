import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import { appConfig } from '../config/app.js';

export class UserService {
    static async createUser(userData) {
        const hashedPassword = bcrypt.hashSync(userData.password, 8);
        return await db.User.create({
            ...userData,
            password: hashedPassword
        });
    }

    static async findUserByEmail(email) {
        return await db.User.findOne({
            where: { email }
        });
    }

    static async validatePassword(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }

    static generateToken(userId) {
        return jwt.sign(
            { id: userId },
            appConfig.jwtSecret,
            { expiresIn: appConfig.jwtExpiration }
        );
    }

    static async updateUserRole(userId, role) {
        const user = await db.User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (role === 'user' && user.role === 'admin') {
            const adminCount = await db.User.count({ where: { role: 'admin' } });
            if (adminCount <= 1) {
                throw new Error('Cannot remove the last admin user');
            }
        }

        await user.update({ role });
        return user;
    }

    static async getAllUsers() {
        return await db.User.findAll({
            attributes: { exclude: ['password'] },
            include: [{
                model: db.Image,
                as: 'images',
                attributes: ['id', 'status']
            }]
        });
    }
}
