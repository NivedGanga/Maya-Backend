const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const OtpService = async (email, callback) => {
    const transporter = require("../config/nodemailer");
    const otpGenerator = require("otp-generator");
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false, digits: true, });
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for signup',
            text: `Your OTP for signup is ${otp}`
        };
        console.log(`OTP for ${email} is ${otp}`);
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
    callback(null, otp);
}

const SignupService = async (email, password, callback) => {
    const { User, Tokens, Roles } = require("../models");
    const saltRounds = 10;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET; // Secret key for signing the access token
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET; // Secret key for signing the refresh token

    try {
        // Hash the password
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        // Save user details in the database
        const user = await User.create({ email, password: hash, salt, isGoogleAuthenticate: false });

        // Generate tokens
        const accessToken = jwt.sign(
            { userId: user.dataValues.userid, email: user.dataValues.email },
            accessTokenSecret,
            { expiresIn: '30d' } // Access token valid for 1 hour
        );

        const refreshToken = jwt.sign(
            { userId: user.dataValues.userid, email: user.dataValues.email },
            refreshTokenSecret,
            { expiresIn: '60d' } // Refresh token valid for 7 days
        );

        const tokens = await Tokens.create({ userid: user.dataValues.userid, access_token: accessToken, refresh_token: refreshToken });
        if (!tokens) {
            return callback('Token not created', null);
        }
        const role = await Roles.create({ userid: user.dataValues.userid, Role: 'manager', Status: 'pending' });
        // Respond with tokens
        callback(null, {
            message: 'Signup successful',
            accessToken: accessToken,
            refreshToken: refreshToken
        });

        console.log('Signup successful');

    } catch (error) {
        console.error(error);
        callback(error, null);
    }
};

const LoginService = async (email, password, callback) => {
    const { User, Tokens } = require("../models");
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET; // Secret key for signing the access token
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET; // Secret key for signing the refresh token

    try {
        // Find the user
        const user = await User.findOne({ where: { email } });

        // Check if user exists
        if (!user) {
            return callback('User not found', null);
        }

        // Check if the password is correct
        // if (!bcrypt.compareSync(password, user.password)) {
        //     return callback('Invalid password', null);
        // }

        // Generate tokens
        const accessToken = jwt.sign(
            { userId: user.dataValues.userid, email: user.dataValues.email },
            accessTokenSecret,
            { expiresIn: '30d' } // Access token valid for 1 hour
        );

        const refreshToken = jwt.sign(
            { userId: user.dataValues.userid, email: user.dataValues.email },
            refreshTokenSecret,
            { expiresIn: '60d' } // Refresh token valid for 7 days
        );

        // Save the jwt tokens in the database
        const tokens = await Tokens.create({ userid: user.dataValues.userid, access_token: accessToken, refresh_token: refreshToken });
        if (!tokens) {
            return callback('Token not created', null);
        }

        // Respond with tokens
        callback(null, {
            message: 'Login successful',
            accessToken: accessToken,
            refreshToken: refreshToken
        });

        console.log('Login successful');

    } catch (error) {
        console.error(error);
        callback(error, null);
    }
}

const LogoutService = async (access_token, callback) => {
    const { Tokens } = require("../models");

    try {
        // Find the refresh token
        const refreshToken = await Tokens.findOne({ where: { access_token } });
        console.log(refreshToken);

        if (!refreshToken) {
            return callback({ message: "Access token not found " }, null);
        }
        console.log(refreshToken.dataValues.refresh_token);
        // Delete the refresh token from the database
        Tokens.destroy({ where: { refresh_token: refreshToken.dataValues.refresh_token } });

        // Respond with success message
        callback(null, { message: 'Logout successful' });
        console.log('Logout successful');
        return;
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
};

module.exports = {
    OtpService,
    SignupService,
    LoginService,
    LogoutService
};
// broker.id = 0
// cluster.id = DIOvMR31SpeAvzWohCVuUQ
// version = 0
