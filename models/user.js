const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
      user.hasMany(models.messages, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  user.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      username: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      image: {
        allowNull: false,
        type: DataTypes.TEXT,
      },
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "user",
      paranoid: true,
    },
  );
  return user;
};
