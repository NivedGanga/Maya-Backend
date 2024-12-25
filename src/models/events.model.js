const { DataTypes } = require('sequelize');
const { dbConnection } = require('../config/database');

const Event = dbConnection.define('Event', {
    eventid: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    eventname: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(1000),
        allowNull: true, // Optional field
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Set default as current timestamp
        allowNull: false,
    },
}, {
    timestamps: false, // Disable automatic createdAt and updatedAt fields
    tableName: 'Events', // Explicitly define the table name
});

module.exports = Event;
