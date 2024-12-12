export const ImageEditModel = (sequelize, DataTypes) => {
  const ImageEdit = sequelize.define('ImageEdit', {
    transformations: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    editedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    previousVersion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    newVersion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    editType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    }
  });

  return ImageEdit;
};
