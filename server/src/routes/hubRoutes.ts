import express from 'express';
import { auth } from '../middleware/auth';
import { HubController } from '../controllers/HubController';

const router = express.Router();

// Create Hub
router.post('/', auth, HubController.createHub);

// Get User's Hubs
router.get('/me', auth, HubController.getMyHubs);

// Update Hub
router.put('/:id', auth, HubController.updateHub);

// PUBLIC: Get Resolved Hub
router.get('/:slug', HubController.getPublicHub);

// ADMIN: Get Hub Details for Management
router.get('/manage/:slug', auth, HubController.getHubAdmin);

export default router;
