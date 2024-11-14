import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {type:String , required:true , unique:true},
    email : {type : String , required : true, unique: true},
    password : {type : String , required : true , unique : true},
    profilepic : {type: String , default:""},
    bio : {type:String , default : ""},
    followers :[{type: mongoose.Schema.ObjectId , ref:"user"}],
    following:[{type: mongoose.Schema.ObjectId , ref:"user"}],
    posts : [{type: mongoose.Schema.ObjectId , ref:"Post"}],
    bookmarks : [{type: mongoose.Schema.ObjectId , ref:"Post"}]
},{timestamps:true});

const User = mongoose.model("User", userSchema);
export default User;