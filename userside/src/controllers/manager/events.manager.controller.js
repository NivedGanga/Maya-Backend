const { getAssignedEventsService, acceptWorkInvitationService, getWorkInvitationsSerice, rejectWorkInvitationService } = require('../../services/events.manager.service');

const getAssignedEventsRequest = (req, res) => {
    const user = req.user;
    //check if user id is provided
    if (!user) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    //get assigned events
    getAssignedEventsService(user, (error, events) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json({
            events: events
        });
    });
}

const getWorkInvitationsRequest = (req, res) => {
    const user = req.user;
    //check if user id is provided
    if (!user) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    //get work invitations
    getWorkInvitationsSerice(user, (error, events) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json({ events: events });
    });
}

const acceptWorkInvitationRequest = (req, res) => {
    const user = req.user;
    const { eventId } = req.body;
    //check if user id and event id is provided
    if (!user || !eventId) {
        return res.status(400).json({ message: 'User ID and Event ID is required' });
    }
    //accept work invitation
    acceptWorkInvitationService(user, eventId, (error, data) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json(data);
    });
}

const rejectWorkInvitationRequest = (req, res) => {
    const user = req.user;
    const { eventId } = req.body;
    //check if user id and event id is provided
    if (!user || !eventId) {
        return res.status(400).json({ message: 'User ID and Event ID is required' });
    }
    //reject work invitation
    rejectWorkInvitationService(user, eventId, (error, data) => {
        if (error) {
            return res.status(500).json({ message: error });
        }
        res.status(200).json(data);
    });
}

module.exports = { getAssignedEventsRequest, getWorkInvitationsRequest, acceptWorkInvitationRequest, rejectWorkInvitationRequest };