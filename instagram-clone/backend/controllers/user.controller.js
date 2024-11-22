import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import getdatauri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

// Register function
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                message: "Try a different email",
                success: false,
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword,
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

// Login function
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Field missing!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Email not registered!",
                success: false,
            });
        }
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.status(401).json({
                message: "Incorrect Password!",
                success: false,
            });
        }
        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        // populate all the posts 

        const populatedPosts = await Promise.all(
            user.posts.map(
                async(postId)=>{
                    const post = await Post.findById(postId);
                    if(post.author.equals(user._id)) return post;
                    return null;
                }
            )
        )

        user = {
           _id : user._id,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
        };


        
        return res
            .cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 })
            .json({
                message: `Welcome back ${user.username}`,
                success: true,
                user,
            });
    } catch (error) {
        console.log(error);
    }
};

// Logout function
export const logout = async (_, res) => {
    try {
        return res.cookie("token", '', { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

// Get Profile function
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

// Edit Profile function
export const editprofile = async (req, res) => {
    try {
        const userid = req.userid;
        const { bio, gender } = req.body;
        const profilepic = req.file;

        let cloudResponse;
        if (profilepic) {
            const fileUri = getdatauri(profilepic);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        let user = await User.findById(userid);
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false,
            });
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilepic) user.profilepic = cloudResponse.secure_url;
        await user.save();

        return res.status(200).json({
            message: "Profile updated",
            success: true,
            user,
        });
    } catch (error) {
        console.log(error);
    }
};

// Follow/Unfollow function
export const followUnfollow = async (req, res) => {
    try {
        const followKarnewala = req.id;
        const jiskoFollowKarunga = req.params.id;

        if (followKarnewala === jiskoFollowKarunga) {
            return res.status(400).json({
                message: "Cannot follow yourself!",
                success: false,
            });
        }

        const user = await User.findById(followKarnewala);
        const targetUser = await User.findById(jiskoFollowKarunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: "User not found!",
                success: false,
            });
        }

        const isFollowing = user.following.includes(jiskoFollowKarunga);

        if (isFollowing) {
            // Unfollow
            await Promise.all([
                user.updateOne({ $pull: { following: jiskoFollowKarunga } }),
                targetUser.updateOne({ $pull: { followers: followKarnewala } }),
            ]);
            return res.status(200).json({ message: 'Unfollowed', success: true });
        } else {
            // Follow
            await Promise.all([
                user.updateOne({ $push: { following: jiskoFollowKarunga } }),
                targetUser.updateOne({ $push: { followers: followKarnewala } }),
            ]);
            return res.status(200).json({ message: 'Following', success: true });
        }
    } catch (error) {
        console.log(error);
    }
};
