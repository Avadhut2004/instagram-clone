import express from 'express';
import isauthenticated from '../middlewares/isauthenticated.js';
import upload from '../middlewares/multer.js';
import { getMessage, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.route('/send/:id').post(isauthenticated,sendMessage);
router.route('/all/:id').get(isauthenticated,getMessage);

export default router;