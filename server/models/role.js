'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    roleTitle: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    classMethods: {
      associate(models) {
        Role.hasMany(models.User, {
          foreignKey: {
            allowNull: false,
          }
        });
      }
    }
  });
  return Role;
};