const { getUsersService, acceptUserService, rejectUserService } = require("../services/users.service");

const getUsersRequest = async (req, res) => {
    const status = req.query.status;
    const email = req.query.query ?? "";
    //check status is provided
    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }
    //check status is valid
    if (status !== 'pending' && status !== 'accepted' && status !== 'rejected') {
        return res.status(400).json({ message: 'Invalid status' });
    }
    //get users
    getUsersService(status, email, (error, users) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json(users);
    });
}

const acceptUserRequest = async (req, res) => {
    console.log(req.body);
    const { userid } = req.body;

    // check userid is provided
    if (!userid) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    acceptUserService(userid, (error, data) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json(data);
    });
}

const rejectUserRequest = async (req, res) => {
    const { userid } = req.body;

    // check userid is provided
    if (!userid) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    rejectUserService(userid, (error, data) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json(data);
    });
}
const getUserRole = async (req, res) => {
    const { Roles } = require('../models');
    console.log(req.user); 
    const { userId } = req.user;
    try {
        const role = await Roles.findOne({ where: { userid: userId } });
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        return res.status(200).json({ role: role.dataValues.Role });
    } catch (error) { 
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = { getUsersRequest, acceptUserRequest, rejectUserRequest, getUserRole };