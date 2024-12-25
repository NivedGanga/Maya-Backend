const getUsersService = async (status, email, callback) => {
    const { Roles, User } = require("../models");
    const { Op } = require("sequelize");

    try {
        // Find all roles matching the given status
        const roleUsers = await Roles.findAll({ where: { Status: status } });
        const userIds = roleUsers.map((roleUser) => roleUser.userid);

        if (!userIds.length) {
            return callback({ message: "No users found for the given status" }, null);
        }

        // Prepare query conditions
        const conditions = { userid: userIds };
        if (email) {
            conditions.email = { [Op.like]: `%${email}%` };
        }

        // Fetch users based on conditions
        const users = await User.findAll({ where: conditions });

        if (!users.length) {
            return callback({ message: "No users found" }, null);
        }

        // Respond with users
        callback(null, { users });
    } catch (error) {
        console.error("Error fetching users:", error);
        callback({ message: "Internal server error", error }, null);
    }
};


const acceptUserService = async (userid, callback) => {
    const { Roles } = require("../models");

    try {
        // Find the user
        const role = await Roles.findOne({ where: { userid } });

        if (!role) {
            return callback({ message: "User not found" }, null);
        }

        // Update the user status
        role.Status = "accepted";
        console.log(role);
        await role.save();

        // Respond with success
        callback(null, { message: "User accepted" });
        console.log('User accepted');
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
}

const rejectUserService = async (userid, callback) => {
    const { Roles } = require("../models");

    try {
        // Find the user
        const role = await Roles.findOne({ where: { userid } });

        if (!role) {
            return callback({ message: "User not found" }, null);
        }

        // Update the user status
        role.Status = "rejected";
        await role.save();

        // Respond with success
        callback(null, { message: "User rejected" });
        console.log('User rejected');
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
}

module.exports = { getUsersService, acceptUserService, rejectUserService };