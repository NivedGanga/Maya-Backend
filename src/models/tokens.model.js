const { DataTypes } = require('sequelize');
const { dbConnection } = require('../config/database'); // Import Sequelize instance

const Tokens = dbConnection.define('Tokens', {
    refresh_token: {
        type: DataTypes.STRING(512),
        primaryKey: true,
        allowNull: false,
    },
    userid: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    access_token: {
        type: DataTypes.STRING(512),
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Default to current timestamp
        allowNull: false,
    },
}, {
    timestamps: false, // Disable automatic createdAt and updatedAt fields
    tableName: 'Tokens', // Explicitly define the table name
    underscored: true, // Use snake_case column names if needed
});

module.exports = Tokens;
