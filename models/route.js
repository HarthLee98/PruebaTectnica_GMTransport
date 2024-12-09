'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    static associate(models) {}
  }
  Route.init(
    {
      code: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: 'route',
      timestamps: true,
      paranoid: true,
    }
  )
  return Route
}
