'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    static associate(models) {}
  }
  Unit.init(
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
      tableName: 'unit',
      timestamps: true,
      paranoid: true,
    }
  )
  return Unit
}
