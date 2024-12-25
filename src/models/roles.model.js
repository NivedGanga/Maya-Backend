const { DataTypes } = require('sequelize');
const { dbConnection } = require('../config/database'); // Import Sequelize instance

const Roles = dbConnection.define('Roles', {
    userid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
    },
    Role: {
        type: DataTypes.ENUM('admin', 'manager'),
        allowNull: false,
    },
    Status: {
        type: DataTypes.ENUM('accepted', 'pending', 'declined'),
        allowNull: false,
    },
}, {
    timestamps: false, // Disable automatic createdAt and updatedAt fields
    tableName: 'Roles', // Explicitly define the table name
    underscored: true, // Use snake_case column names if needed
});

module.exports = Roles;
