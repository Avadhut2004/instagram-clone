import express from 'express';
import isauthenticated from '../middlewares/isauthenticated.js';
import upload from '../middlewares/multer.js';
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from '../controllers/post.controller.js';


const router = express.Router();

router.route('/addpost').post(isauthenticated,upload.single('image'),addNewPost);
router.route('/all').get(isauthenticated,getAllPost);
router.route('/userpost/all').get(isauthenticated,getUserPost);
router.route('/:id/like').get(isauthenticated,likePost);
router.route('/:id/dislike').get(isauthenticated,dislikePost);
router.route('/:id/comment').post(isauthenticated,addComment);
router.route('/:id/comment/all').get(isauthenticated,getCommentsOfPost);
router.route('/delete/:id').delete(isauthenticated,deletePost);
router.route('/:id/bookmark').get(isauthenticated,bookmarkPost);


export default router;