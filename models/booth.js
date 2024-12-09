'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Booth extends Model {
    static associate(models) {}
  }
  Booth.init(
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
      tableName: 'booth',
      timestamps: true,
      paranoid: true,
    }
  )
  return Booth
}
