const express = require('express');
const routes = express.Router();
const upload = require('../../config/file');
const { createEventRequest, getEventsRequest, deleteEventRequest, updateEventRequest, inviteUserToEventRequest, getAssigedUsersRequest, uploadEventImageRequest, getEventImagesRequest, deleteEventImageRequest } = require('../../controllers/events.controller');

routes.post('/create', createEventRequest);
routes.get('/', getEventsRequest);
routes.delete('/', deleteEventRequest);
routes.put('/', updateEventRequest);
routes.post('/invite', inviteUserToEventRequest);
routes.get('/users', getAssigedUsersRequest);
routes.post('/upload', upload.single('file'), uploadEventImageRequest);
routes.get('/images', getEventImagesRequest);
routes.delete('/images', deleteEventImageRequest);

module.exports = routes;