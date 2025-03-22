// const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const { Sequelize } = require('sequelize');

try {
    const dbConnection = new Sequelize({
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        // ssl: true,
        logging: false
    });
    //also check db connection
    dbConnection.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch((error) => {
            console.error('Unable to connect to the database:', error);
        });
    module.exports = {
        dbConnection,
    };

} catch (error) {
    console.error('Error connecting to DB', error);
    process.exit(1);
}

