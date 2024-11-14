import sharp from 'sharp';
import { Post } from '../models/post.model.js';
import { Comment } from '../models/Comment.model.js';
import  User from '../models/user.model.js';
import cloudinary from 'cloudinary';

export const addNewPost = async (req, res) => {
    try {
        const caption = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            return res.status(400).json({ message: "image not found", success: false })
        }

        const OptimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // buffer to data uri for uploading into cloudinary

        const fileUri = `data:image/jpeg:base64,${OptimizedImageBuffer.toString('base64')}`;

        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image : cloudResponse.secure_url,
            author : authorId
        });

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: ('-password') });

        return res.status(200).json({
            message: 'new post added',
            success: true
        })
    }
    catch (error) {
        console.log(error);
    }
}

export const getAllPost = async (req, res) => {
    try {

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('author', 'username profilepic')
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'author',
                    select: 'username profilepic'
                }
            });

        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const getUserPost = async(req,res)=>{
    try {
        const authorId = req.id;
        const posts = await Post.find({author : authorId}).sort({createdAt : -1}).populate({
            path:'author',
            select : 'username profilepic'
        }).populate({
            path:'comments',
            sort:{createdAt : -1},
            populate:{
                path:'author',
                select:'username profilepic'
            }
        });
        return res.status(201).json({
            posts,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
};

export const likepost= async(req,res)=>{
  try {
    const likekarnewala = req.id;
    const postid = req.params.id;
    const post = await Post.findById(postid);
    if(!post){
        return res.status(400).json({
            message:'post not found',
            success : false
        })
    }

    // like logic 
    await post.updateOne({$addToSet:{like:likekarnewala}});
    await post.save();

    // socket logic for realtime notification

    return res.status(200).json({
        message:'post liked',success:true
    })
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async(req,res)=>{
    try {const likekarnewala = req.id;
        const postid = req.params.id;
        const post = await Post.findById(postid);
        if(!post){
            return res.status(400).json({
                message:'post not found',
                success : false
            })
        }
    
        // like logic 
        await post.updateOne({$pull:{like:likekarnewala}});
        await post.save();
    
        // socket logic for realtime notification
        
        return res.status(200).json({
            message:'post disliked',success:true
        })
        
    } catch (error) {
        console.log(error);
    }
};

export const addComment = async(req,res)=>{
    try {
        const postId = req.params.id;
        const commentkarnewala = req.id;

        const {text} = req.body;

        const post = await Post.findById(postid);

        if(!text){return res.status(400).json({message:'comment text is required' , success : false})};

        const comment = await Comment.create({
            text,
            author:commentkarnewala,
            post:postId
        });

        await comment.populate({
            path:'author',
            select:'username profilepic'
        });

        post.comments.push(comment._id);
        await post.save();

        return res.status(200).json({message : 'commented' ,comment, success:true});



    } catch (error) {
        console.log(error);
    }
};

export const getCommentsOfPost = async(req,res)=>{
    try {
        const postId = req.params.id;

        const comments = await Comment.find({post:postId}).populate('author','username profilepic');

        if(!comments) return res.status(400).json({message:'comment not found ' ,success :false});

        return res.status(201).json({comments,success:true});
        
    } catch (error) {
        console.log(error);
    }
};

export const deletePost = async(req,res)=>{
   try {
    const postId = req.params.id;
    const deletekarnewala = req.id;

    const post = await Post.findById(postId);

    if(!post)  return res.status(400).json({message:'post not found' ,success :false});

    if(post.author.toString()!==deletekarnewala) return res.status(400).json({message:'only author can delete' ,success :false});

    // delete post 
    await Post.findByIdAndDelete(postId);

    // update users posts

    let user = User.findById(deletekarnewala);
    await user.posts.filter(id=>id.toString() !== postId);//removed the post 
    await user.save();
    // delete associated comments 

    await Comment.deleteMany({post:postId});

    return res.status(200).json({
        message:'post deleted',
        success:true
    });

   } catch (error) {
    console.log(error);
   }
};

export const bookmarkPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(400).json({message:'post not found' ,success :false});

        const user = await User.findById(authorId);;

        if(user.bookmarks.includes(post._id)){
            // already bookmarked -> remove from bookmarks 
            await user.updateOne({$pull:{bookmarks: post._id}});
            await user.save();

            return res.status(201).json({
                message:"unsaved",
                success:true
            });
        }
        else{
            // not bookmarked-> add to bookmarks 
            await user.updateOne({$addToSet:{bookmarks: post._id}});
            await user.save();

            return res.status(201).json({
                message:"saved",
                success:true
            });
        }

    } catch (error) {
        console.log(error);
    }
};
