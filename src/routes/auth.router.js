const express = require('express');
const routes = express.Router();
const { OtpRequest, verifyOtpRequest, SignupRequest,LoginRequest} = require('../controllers/auth.controller');

//sign up routes
routes.route('/signup/sendotp').post(OtpRequest);
routes.route('/signup/verify').post(verifyOtpRequest);
routes.route('/signup').post(SignupRequest);

//login routes
routes.route('/login').post(LoginRequest);

module.exports = routes;