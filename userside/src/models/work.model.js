const { DataTypes } = require('sequelize');
const { dbConnection } = require('../config/database'); // Import Sequelize instance

const Work = dbConnection.define('work', {
    workid: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    eventid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'events', // Table name of the associated model
            key: 'eventid',  // Column in the Events table
        },
        onDelete: 'CASCADE', // Cascade deletion when an event is deleted
    },
    userid: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'users', // Table name of the associated model
            key: 'userid',   // Column in the Users table
        },
    },
    isAccepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Optional: set default as `false`
    },
}, {
    timestamps: false, // Disable automatic createdAt and updatedAt fields
    tableName: 'work', // Explicitly define the table name
});

module.exports = Work;
