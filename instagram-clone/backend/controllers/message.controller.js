// for real time chatting 

import { conversation } from "../models/conversation.model.js";

export const sendMessage = async(req,res)=>{
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {textMessage : message} = req.body;

        let conversation = await conversation.findOne({
            participants : {$all :[senderId , receiverId]}
        });

        if(!conversation) {
            conversation = await conversation.create({
                participants:[senderId,receiverId]
            })
        };

        const newMessage = await message.create({
            senderId:senderId,
            receiverId : receiverId,
            message : message
        });

        if(newMessage) conversation.messages.push(newMessage._id);

        await Promise.all([conversation.save(),message.save()]);

        // socket logic 

        return res.status(201).json({message , success:true});
        
    } catch (error) {
        console.log(error);
    }
};

export const getMessage = async(req,res)=>{
    try {
        const senderId = req.id;
        const receiverID = req.params.id;
        const conversation = await conversation.find({
            participants :{$all :[senderId,receiverID]}
        });
        if(!conversation) {return res.status(201).json({
            messages:[],success : true
        })};

        return res.status(201).json({
            success : true , messages:conversation?.messages
        });
    } catch (error) {
        console.log(error);
    }
}