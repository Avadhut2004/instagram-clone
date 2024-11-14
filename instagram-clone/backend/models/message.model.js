import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderID :{type:String , required:true},
    receiverID :{type:String ,required : true},
    message :{type : String , required : true}
});

export message = mongoose.model('message',messagrSchema);