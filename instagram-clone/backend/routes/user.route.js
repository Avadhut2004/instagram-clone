import express from 'express';
import { editprofile, followUnfollow, getprofile, login, logout, register } from '../controllers/user.controller.js';
import isauthenticated from '../middlewares/isauthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isauthenticated,getprofile);
router.route('/profile/edit').post(isauthenticated,upload.single('profilepicture'),editprofile);
router.route('/followUnfollow/:id').post(isauthenticated,followUnfollow);

export default router;
