const { Events, User, Work } = require('../models');

const getAssignedEventsService = async (userId, callback) => {
    try {
        // Find all events assigned to the user from work
        const assignedEvents = await Work.findAll({ where: { userid: userId } });
        // Get the event details for each event from Events
        const events = await Promise.all(assignedEvents.map(async (assignedEvent) => {
            const event = await Events.findOne({ where: { eventid: assignedEvent.eventid } });
            return event;
        }));
        //check if events are found
        if (!events) {
            return callback({ message: "No events found" }, null);
        }
        // Respond with success
        callback(null, events);
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
}

const getWorkInvitationsSerice = async (userId, callback) => {
    try {
        // Find all events assigned to the user from work
        const assignedEvents = await Work.findAll({ where: { userid: userId, isAccepted: false } });
        // Get the event details for each event from Events
        const events = await Promise.all(assignedEvents.map(async (assignedEvent) => {
            const event = await Events.findOne({ where: { eventid: assignedEvent.eventid } });
            return event;
        }));
        //check if events are found
        if (!events) {
            return callback({ message: "No events found" }, null);
        }
        // Respond with success
        callback(null, events);
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
}
const acceptWorkInvitationService = async (userId, eventId, callback) => {
    try {
        // Find the event
        const work = await Work.findOne({ where: { userid: userId, eventid: eventId } });
        if (!work) {
            return callback({ message: "Work not found" }, null);
        }
        // Update the event
        await Work.update({ isAccepted: true }, { where: { userid: userId, eventid: eventId } });
        // Respond with success
        callback(null, { message: "Work accepted" });
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
}
const rejectWorkInvitationService = async (userId, eventId, callback) => {
    try {
        // Find the event
        const work = await Work.findOne({ where: { userid: userId, eventid: eventId } });
        if (!work) {
            return callback({ message: "Work not found" }, null);
        }
        // Update the event
        await Work.destroy({ where: { userid: userId, eventid: eventId } });
        // Respond with success
        callback(null, { message: "Work rejected" });
    } catch (error) {
        console.error(error);
        callback(error, null);
    }
}
module.exports = { getAssignedEventsService, getWorkInvitationsSerice, acceptWorkInvitationService, rejectWorkInvitationService };