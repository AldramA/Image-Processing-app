export const ImageModel = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    originalName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mimetype: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    transformations: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    currentVersion: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'original'
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('active', 'archived', 'deleted'),
      defaultValue: 'active'
    }
  });

  return Image;
};
