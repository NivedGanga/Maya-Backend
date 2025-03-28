const { DataTypes } = require('sequelize');
const { dbConnection } = require('../config/database'); // Import Sequelize instance

const Filestore = dbConnection.define('filestore', {
    fileid: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    filename: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    filesize: {
        type: DataTypes.BIGINT,
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
}, {
    timestamps: false, // Disable automatic createdAt and updatedAt fields
    tableName: 'filestore', // Explicitly define the table name
    underscored: true, // Use snake_case column names if needed
});

module.exports = Filestore;
