const transporter = require("../config/nodemailer");
const { User } = require("../models");
const { OtpService, SignupService, LoginService, LogoutService } = require('../services/auth.service');

const OtpRequest = async (req, res) => {
    const { email } = req.body;

    // check email is provided
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    //check email is in currect format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }

    //check if email is already exists
    const user = await User.findOne({ where: { email } });
    if (user) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    //check if otp is already sent
    if (req.session.otp) {
        console.log(req.session.otp);
        return res.status(400).json({ message: 'OTP already sent' });
    }

    //send otp
    OtpService(email, (error, success) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        req.session.otp = success;
        req.session.email = email;
        res.status(200).json({ message: 'OTP sent' });
    })
}

const verifyOtpRequest = async (req, res) => {
    const { otp } = req.body;
    // check otp is provided
    if (!req.session.otp) {
        return res.status(400).json({ message: 'No OTP sent' });
    }
    // check otp is verified
    if (req.session.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    delete req.session.otp;
    req.session.isVerified = true;
    res.status(200).json({ message: 'Email successfuly verified' });
}

const SignupRequest = async (req, res) => {
    const { email, password } = req.body;

    // check email and password is provided
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    //check password is in currect format
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one digit, one lowercase and one uppercase letter, and at least 6 characters' });
    }

    // check if otp is verified
    if (!req.session.email && !req.session.isVerified && req.session.email !== email) {
        return res.status(400).json({ message: 'Please verify again' });
    }

    // check if email is already exists
    const user = await User.findOne({ where: { email } });
    if (user) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    // signup
    SignupService(email, password, (error, success) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(201).json(success);
    });
    req.session.destroy();
}

const LoginRequest = async (req, res) => {
    const { email, password } = req.body;
    // check email and password is provided
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    //check password is in currect format
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must contain at least one digit, one lowercase and one uppercase letter, and at least 6 characters' });
    }

    //check email is in currect format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }

    // login
    LoginService(email, password, (error, success) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json(success);
    });
}

const LogoutRequest = async (req, res) => {
    const access_token = req.headers['authorization'];
    // check access token is provided
    if (!access_token) {
        return res.status(400).json({
            message: 'Access tokenis required'
        });
    }
    // check if access token is in currect format
    if (!access_token.startsWith('Bearer ')) {
        return res.status(400).json({
            message: 'Invalid access token format'
        });
    }
    //cut the bearer
    const accessToken = access_token.slice(7);

    // logout
    LogoutService(accessToken, (error, success) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
        return res.status(200).json(success);
    });
}

module.exports = {
    OtpRequest,
    verifyOtpRequest,
    SignupRequest,
    LoginRequest,
    LogoutRequest
};