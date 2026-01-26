import express from 'express';
import { auth } from '../middleware/auth';
import { LinkController } from '../controllers/LinkController';

const router = express.Router();

// Add Link to Hub
router.post('/', auth, LinkController.createLink);

// Update Link
router.put('/:id', auth, LinkController.updateLink);

// Delete Link
router.delete('/:id', auth, LinkController.deleteLink);

// PUBLIC: Click Link
// PUBLIC: Click Link
router.post('/:id/click', LinkController.trackClick);

// URL Shortener
import { createShortLink } from '../controllers/LinkShortenerController';
router.post('/shorten', auth, createShortLink);

export default router;
