const { createEventService, getEventsService, deleteEventService, updateEventService, inviteUserToEventService, getAssignedUsersService, uploadEventImageService, getEventImagesService, deleteEventImageService } = require('../services/events.service');

const createEventRequest = (req, res) => {
    const { eventName, eventDescription, startDate, endDate } = req.body;
    //check if all required fields are present
    if (!eventName || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    //create event 
    createEventService(eventName, eventDescription, startDate, endDate, (error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }
        return res.status(201).json(data);
    });
}

const getEventsRequest = async (req, res) => {
    const status = req.query.status ?? 'all';
    //check status is valid
    if (status !== 'upcoming' && status !== 'ongoing' && status !== 'completed' && status !== 'all') {
        return res.status(400).json({ message: 'Invalid status' });
    }
    //get events
    getEventsService(status, (error, events) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json(events);
    });
}

const deleteEventRequest = async (req, res) => {
    const { eventId } = req.body;
    //check if event id is provided
    if (!eventId) {
        return res.status(400).json({ message: 'Event ID is required' });
    }
    //delete event
    deleteEventService(eventId, (error, data) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json(data);
    });
}

const updateEventRequest = async (req, res) => {
    const { eventId, eventName, eventDescription, startDate, endDate } = req.body;
    //check if event id is provided
    if (!eventId) {
        return res.status(400).json({ message: 'Event ID is required' });
    }
    //check if all required fields are present
    if (!eventDescription || !eventName || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    //update event
    updateEventService(eventId, eventName, eventDescription, startDate, endDate, (error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }
        return res.status(200).json(data);
    });
}

const inviteUserToEventRequest = async (req, res) => {
    const { eventId, userIds } = req.body;
    //check if event id and user id is provided
    if (!eventId || !userIds) {
        return res.status(400).json({ message: 'Event ID and User ID is required' });
    }
    //invite user to event
    inviteUserToEventService(userIds, eventId, (error, data) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json(data);
    });
}

const getAssigedUsersRequest = async (req, res) => {
    const { eventId } = req.body;
    //check if event id is provided
    if (!eventId) {
        return res.status(400).json({ message: 'Event ID is required' });
    }
    //get assigned users
    getAssignedUsersService(eventId, (error, data) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json(data);
    });
}

const uploadEventImageRequest = async (req, res) => {
    //get event id from params
    const eventId = req.query.eventId;
    //check if event id is provided
    if (!eventId) {
        return res.status(400).json({ message: 'Event ID is required' });
    }
    //check if image is provided
    if (!req.file) {
        return res.status(400).json({ message: 'Image is required' });
    }

    // upload event image
    uploadEventImageService(eventId, req.file, (error, data) => {
        if (error) {
            return res.status(500).json(error);
        }
        res.status(200).json(data);
    });
}
const getEventImagesRequest = async (req, res) => {
    const { eventId } = req.body;
    //check if event id is provided
    if (!eventId) {
        return res.status(400).json({ message: 'Event ID is required' });
    }
    //get assigned user
    getEventImagesService(eventId, (error, data) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json(data);
    });
}
const deleteEventImageRequest = async (req, res) => {
    const { eventId, fileid } = req.body;
    //check if event id and image id is provided
    if (!eventId || !fileid) {
        return res.status(400).json({ message: 'Event ID and Image ID is required' });
    }
    //delete event image
    deleteEventImageService(eventId, fileid, (error, data) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json(data);
    });
}
module.exports = {
    createEventRequest,
    getEventsRequest,
    deleteEventRequest,
    updateEventRequest,
    inviteUserToEventRequest,
    getAssigedUsersRequest,
    uploadEventImageRequest,
    getEventImagesRequest,
    deleteEventImageRequest
};