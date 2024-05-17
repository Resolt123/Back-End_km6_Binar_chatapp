"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      messages.belongsTo(models.user, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  messages.init(
    {
      message: DataTypes.TEXT,
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "user",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "messages",
    },
  );
  return messages;
};
