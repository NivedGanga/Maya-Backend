const express = require('express');
const routes = express.Router();
const { acceptWorkInvitationRequest, getAssignedEventsRequest, getWorkInvitationsRequest, rejectWorkInvitationRequest, } = require('../../controllers/manager/events.manager.controller');
const { uploadEventImageRequest, getEventImagesRequest, deleteEventImageRequest } = require('../../controllers/events.controller');
const upload = require('../../config/file');

routes.get('/invites', getWorkInvitationsRequest);
routes.post('/invites/accept', acceptWorkInvitationRequest);
routes.post('/invites/reject', rejectWorkInvitationRequest);
routes.get('/', getAssignedEventsRequest);
routes.post('/upload', upload.single('file'), uploadEventImageRequest);
routes.get('/images', getEventImagesRequest);
routes.delete('/images', deleteEventImageRequest);

module.exports = routes;