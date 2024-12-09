'use strict'
const { Model } = require('sequelize')
const bcrypt = require('bcrypt') // Librería para encriptar contraseñas

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define asociaciones aquí si es necesario
    }

    // Método para verificar la contraseña ingresada por el usuario
    static async checkPassword(inputPassword, hashedPassword) {
      return await bcrypt.compare(inputPassword, hashedPassword)
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true, // No puede estar vacío
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Valida que sea un correo válido
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 100], // Mínimo 8 caracteres
        },
      },
      token: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: 'user',
      timestamps: true, // Incluye createdAt y updatedAt
      paranoid: true, // Habilita soft delete con deletedAt
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt)
          }
          user.name = user.name.trim() // Elimina espacios extra del nombre
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(user.password, salt)
          }
          if (user.changed('name')) {
            user.name = user.name.trim() // Elimina espacios extra del nombre
          }
        },
      },
    }
  )
  return User
}
