const { DataTypes } = require('sequelize');
const { dbConnection } = require('../config/database'); // Import Sequelize instance

const Otps = dbConnection.define('otps', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expires: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: false, // Disable automatic createdAt and updatedAt fields
    tableName: 'otps', // Explicitly define the table name
    underscored: true, // Use snake_case column names if needed
});

dbConnection.sync()
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Database sync failed:', err));

module.exports = Otps;