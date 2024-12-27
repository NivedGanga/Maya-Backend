const { DataTypes } = require('sequelize');
const { dbConnection } = require('../config/database');

const Users = dbConnection.define('users', {
    userid: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    salt: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    isGoogleAuthenticate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    googleToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    timestamps: false,
    tableName: 'users',
});

module.exports = Users;
