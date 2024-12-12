import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

// Import models
import { UserModel } from './user.model.js';
import { ImageModel } from './image.model.js';
import { ImageEditModel } from './imageEdit.model.js';

// Initialize models
const User = UserModel(sequelize, Sequelize);
const Image = ImageModel(sequelize, Sequelize);
const ImageEdit = ImageEditModel(sequelize, Sequelize);

// Define relationships
User.hasMany(Image, { as: 'images', foreignKey: 'userId' });
Image.belongsTo(User, { as: 'owner', foreignKey: 'userId' });

Image.hasMany(ImageEdit, { as: 'edits', foreignKey: 'imageId' });
ImageEdit.belongsTo(Image, { as: 'image', foreignKey: 'imageId' });

User.hasMany(ImageEdit, { as: 'editsMade', foreignKey: 'editedBy' });
ImageEdit.belongsTo(User, { as: 'editor', foreignKey: 'editedBy' });

const db = {
  sequelize,
  Sequelize,
  User,
  Image,
  ImageEdit
};

export default db;
