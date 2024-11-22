import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    comment : {type:String , required :true},
    author :{type : mongoose.Schema.Types.ObjectId , ref:'User' , required : true},
    post :{type : mongoose.Schema.Types.ObjectId , ref:'Post'},
});

export const Comment = mongoose.model("Comment",commentSchema);