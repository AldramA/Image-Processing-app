import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { requestLogger } from './middleware/logger.middleware.js';
import { appConfig } from './config/app.js';
import db from './models/index.js';
import { UserService } from './services/user.service.js';
import authRoutes from './routes/auth.routes.js';
import imageRoutes from './routes/image.routes.js';
import adminRoutes from './routes/admin.routes.js';

config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit(appConfig.rateLimiting);
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!' });
});

// Create admin user if not exists
const createAdminUser = async () => {
    try {
        const adminUser = await db.User.findOne({ where: { role: 'admin' } });
        if (!adminUser) {
            await UserService.createUser({
                username: 'admin',
                password: 'admin123',
                email: 'admin@example.com',
                role: 'admin'
            });
            console.log('Admin user created successfully');
        }
    } catch (err) {
        console.error('Error creating admin user:', err);
    }
};

// Database synchronization and server start
const startServer = async () => {
    try {
        await db.sequelize.sync();
        await createAdminUser();
        app.listen(appConfig.port, () => {
            console.log(`Server is running on port ${appConfig.port}`);
        });
    } catch (err) {
        console.error('Unable to start server:', err);
        process.exit(1);
    }
};

startServer();