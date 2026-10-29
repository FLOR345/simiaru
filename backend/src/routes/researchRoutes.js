import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { validate, schemas } from '../middleware/validation.js';
import { getConsent, setConsent, recordEvents, exportMine, deleteMine, exportAll } from '../controllers/researchController.js';

const router = express.Router();

router.get('/consent', protect, getConsent);
router.put('/consent', protect, validate(schemas.consent), setConsent);
router.post('/events', protect, validate(schemas.events), recordEvents);
router.get('/export/me', protect, exportMine);          // ?format=csv | json
router.delete('/events/me', protect, deleteMine);
router.get('/export', protect, isAdmin, exportAll);     // ?format=csv | json (seudonimizado)

export default router;
