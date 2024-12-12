const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const { Sequelize } = require('sequelize');

try {
    console.log(process.env.DB_USER);
    const connection = mysql.createPool({
        host: process.env.HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    const dbConnection = new Sequelize({
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    });
    module.exports = {
        dbConnection,
        connection
    };
    console.log('Connected to DB');
} catch (error) {
    console.error('Error connecting to DB', error);
    process.exit(1);
}



