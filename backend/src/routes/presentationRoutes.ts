import { Router } from 'express';
import presentationController from '../controllers/presentationController';

const router = Router();

// Convert a webpage to an Alai presentation
router.post('/convert', presentationController.convertWebpage);

// Health check endpoint
router.get('/health', presentationController.healthCheck);

export default router;