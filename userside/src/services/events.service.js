const { Events, Filestore, Work } = require('../models');
const { upload } = require('../config/file');
const fs = require("fs");
const path = require("path");
const { fetchAndSendBatch } = require('./imageproc.service');
const { Readable } = require("stream"); // For converting buffer to stream
const cloudinary = require('../config/cloudinary');
const createEventService = async (eventName, eventDescription, startDate, endDate, managers, callback) => {
    try {
        // Validate required fields
        if (!eventName || !eventDescription || !startDate || !endDate) {
            return callback('Missing required event fields', null);
        }

        // Create the event
        const event = await Events.create({
            eventname: eventName,
            description: eventDescription,
            startDate,
            endDate,
        });
 
        // Check if event is created
        if (!event) {
            return callback('Event not created', null);
        }

        // Refresh the event instance to get the auto-incremented ID
        const createdEvent = await event.reload();

        // Add all managers to the work table
        await Promise.all(managers.map(async managerId => {
            await Work.create({
                eventid: createdEvent.eventid,
                userid: managerId,
                isAccepted: false,
            });
        }));

        // Respond with success message
        callback(null, {
            message: 'Event created successfully',
            eventId: createdEvent.eventid
        });
    } catch (error) {
        console.error('Error in createEventService:', error);
        callback(error.message || 'Error creating event', null);
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

        // Fetch banner images for all events
        for (const event of events) {
            // Find the first image in filestore for this event
            const banner = await Filestore.findOne({
                where: { eventid: event.eventid },
                order: [['fileid', 'ASC']] // Get the first uploaded image
            });
            // Add banner URL to event object
            event.banner = banner ? banner.url : null;
        }

        // Filter events based on status
        if (status === 'upcoming') {
            events = events.filter(event => new Date(event.startDate) > new Date());
        } else if (status === 'ongoing') {
            events = events.filter(event => new Date(event.startDate) <= new Date() && new Date(event.endDate) >= new Date());
        } else if (status === 'completed') {
            events = events.filter(event => new Date(event.endDate) < new Date());
        } else if (status === 'all') {
            // Return all events, no filtering needed
        } else {
            return callback({ message: "Invalid status" }, null);
        }

        // Respond with events
        callback(null, { events: events });
        console.log('Events found with banner images');

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
function bufferToStream(buffer) {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // Signal end of stream
    return stream;
}

const uploadEventImageService = async (eventId, file, callback) => {
    try {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "your-folder-name", // Replace with your Cloudinary folder name
                public_id: `${Date.now()}_${file.originalname.replace(/ /g, "_")}`,
            },
            async (err, result) => {
                if (err) {
                    console.error("Cloudinary upload error:", err);
                    return callback(err, null);
                }
                console.log("Uploaded to Cloudinary:", result.url);

                // Optionally save the metadata to your database
                const filestore = await Filestore.create({
                    eventid: eventId,
                    filename: file.originalname,
                    url: result.secure_url,
                    filesize: file.size,
                });

                // Check if file is saved
                if (!filestore) {
                    return callback("File not saved", null);
                }

                // Respond with success message
                callback(null, {
                    message: "Image uploaded successfully",
                    path: result.secure_url,
                });
                fetchAndSendBatch(); // Assuming this is a function to execute post-upload tasks
            }
        );
        // Convert buffer to stream and pipe it to the upload stream
        bufferToStream(file.buffer).pipe(uploadStream);
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

const getEventDetailsService = async (eventId, callback) => {
    try {
        // Find the event
        const event = await Events.findOne({ where: { eventid: eventId } });

        if (!event) {
            return callback({ message: "Event not found" }, null);
        }
        // Check if the filestore table has any image with this eventId
        const banner = await Filestore.findOne({
            where: { eventid: eventId },
            order: [['fileid', 'ASC']] // Get the file with the least fileid
        });

        // Add the banner URL to the event object if found
        event.dataValues.banner = banner ? banner.url : null;

        // Respond with the event
        callback(null, { event: event });
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
    deleteEventImageService,
    getEventDetailsService
};