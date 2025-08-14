import express from 'express'
import { handlestudentdata } from '../controllers/user.controllers.js';
import { upload } from '../middleware/multer.middleware.js';

const router = express.Router()

router.route('/data').post(upload.single('csvFile'), handlestudentdata)

export default router;