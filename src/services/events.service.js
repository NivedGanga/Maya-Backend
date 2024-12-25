const { Events, Filestore } = require('../models');
const { upload } = require('../config/file');
const fs = require("fs");
const path = require("path");

const createEventService = (eventName, eventDescription, startDate, endDate, callback) => {
    try {
        // Create the event
        const event = Events.create({
            eventname: eventName,
            description: eventDescription,
            startDate,
            endDate,
        });
        // check if event is created
        if (!event) {
            return callback('Event not created', null);
        }
        // Respond with success message
        callback(null, { message: 'Event created' });
    } catch (error) {
        // Log the error
        console.error(error);
        callback(error, null);
    }
}

const getEventsService = async (status, callback) => {
    try {
        // Find all events
        const res = await Events.findAll();
        // check if events are found
        if (!res) {
            return callback({ message: "No events found" }, null);
        }
        let events = res.map(event => event.dataValues);
        // check statuses upcoming ongoing and past with current date
        if (status === 'upcoming') {
            events = events.filter(event => new Date(event.startDate) > new Date());
        } else if (status === 'ongoing') {
            events = events.filter(event => new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date());
        } else if (status === 'completed') {
            events = events.filter(event => new Date(event.endDate) < new Date());
        } else if (status === 'all') {
        } else {
            return callback({ message: "Invalid status" }, null);
        }
        // Respond with events
        callback(null, { events: events });
        console.log('Events found');

    } catch (error) {
        // Log the error
        console.error(error);
        callback(error, null);
    }
}

const updateEventService = async (eventId, eventName, eventDescription, startDate, endDate, callback) => {
    try {
        // Find the event
        const event = await Events.findOne({ where: { eventid: eventId } });

        if (!event) {
            return callback({ message: "Event not found" }, null);
        }

        // Update the event only if the field is not empty
        if (eventName) {
            event.eventname = eventName;
        }
        if (eventDescription) {
            event.description = eventDescription;
        }
        if (startDate) {
            event.startDate = startDate;
        }
        if (endDate) {
            event.endDate = endDate;
        }

        // Save the event
        await event.save();

        // Respond with success
        callback(null, { message: "Event updated" });
        console.log('Event updated');
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
}

const deleteEventService = async (eventId, callback) => {
    try {
        // Find the event
        const event = await Events.findOne({ where: { eventid: eventId } });

        if (!event) {
            return callback({ message: "Event not found" }, null);
        }

        // Delete the event
        await Events.destroy({ where: { eventid: eventId } });

        // Respond with success
        callback(null, { message: "Event deleted" });
        console.log('Event deleted');
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
}

const inviteUserToEventService = async (userids, eventid, callback) => {
    try {
        console.log(userids);
        console.log(eventid);
        //check the users role is accepted
        const { Roles, Work } = require('../models');
        const roles = await Roles.findAll({ where: { userid: userids } });
        console.log(roles);
        roles.forEach(role => {
            if (role.dataValues.Status !== 'accepted') {
                return callback({ message: "invalid users" }, null);
            }
        });
        //add all users to event in work 
        userids.forEach(async userid => {
            await Work.create({
                eventid,
                userid,
            });
        });
        // Respond with success
        callback(null, { message: "Users invited to event" });
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
}
const getAssignedUsersService = async (eventid, callback) => {
    try {
        const { Work } = require('../models');
        const assineUsers = await Work.findAll({ where: { eventid, isAccepted: true } });
        //get user id from work to an array
        let userIds = assineUsers.map(user => user.dataValues.userid);
        //get email from users of these user ids
        const { User } = require('../models');
        const usersData = await User.findAll({ where: { userid: userIds } });
        //get email and userid from users
        const users = usersData.map(user => {
            return {
                email: user.dataValues.email,
                userid: user.dataValues.userid
            }
        });
        if (!users) {
            return callback({ message: "No users found" }, null);
        }
        // Respond with success
        callback(null, { users: users });
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
}

const uploadEventImageService = async (eventId, file, callback) => {
    try {
        // Check if event exists
        const event = await Events.findOne({ where: { eventid: eventId } });
        if (!event) {
            return callback({ message: "Event not found" }, null);
        }

        // Define the directory where the file will be saved
        const uploadDir = path.join(".", "src", "uploads"); // Example: /uploads folder in the project root

        // Create the directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Define the full file path set current date and time as file name
        const filename = `${Date.now()}_${file.originalname.replace(/ /g, "_")}`;
        const filePath = path.join(uploadDir, filename);
        const relativePath = path.join("uploads", filename);
        // Write the file buffer to the specified path
        fs.writeFile(filePath, file.buffer, async (err) => {
            if (err) {
                console.error("File save error:", err);
                return callback(err, null);
            }
            console.log("File saved to:", filePath);

            // Optionally save the file path or metadata to your database
            const filestore = await Filestore.create({
                eventid: eventId,
                filename: file.originalname,
                url: relativePath,
            });

            //check if file is saved
            if (!filestore) {
                return callback('File not saved', null);
            }

            const fileUrl = `${process.env.BASE_URL || "http://localhost:5001"}/uploads/${filename}`;
            // Respond with success message
            callback(null, { message: "Image uploaded successfully", path: fileUrl });
        });
    } catch (error) {
        console.error("Service error:", error);
        callback(error, null);
    }
};
const getEventImagesService = async (eventId, callback) => {
    try {
        // Find all files for the event
        const files = await Filestore.findAll({ where: { eventid: eventId } });
        //check if files are found
        if (!files) {
            return callback({ message: "No files found" }, null);
        }
        // Respond with files
        callback(null, { files: files });
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
}
const deleteEventImageService = async (eventId, fileid, callback) => {
    try {
        // Find the file
        const file = await Filestore.findOne({ where: { eventid: eventId, fileid: fileid } });

        if (!file) {
            return callback({ message: "File not found" }, null);
        }

        // Delete the file
        await Filestore.destroy({ where: { eventid: eventId, fileid: fileid } });
        // Delete the file from the file system
        const filePath = path.join(".", "src", file.url);
        fs.unlinkSync(filePath);

        // Respond with success
        callback(null, { message: "File deleted" });
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
}
module.exports = {
    createEventService,
    getEventsService,
    updateEventService,
    deleteEventService,
    inviteUserToEventService,
    getAssignedUsersService,
    uploadEventImageService,
    getEventImagesService,
    deleteEventImageService
};