const Chats = require('../models/chats');
const {Op} = require('sequelize');

exports.addChat = async (req,res,next) => {
    const {chat} = req.body;
    
    try{
        const response = await req.user.createChat({chat:chat});
        response.dataValues = {...response.dataValues, userId:null,isCurrent:'true'}; 
        response._previousDataValues = {...response._previousDataValues, userId:null,isCurrent:'true'};
        return res.status(201).json({message:"Successful", response:response});
    }
    catch(err){
        return res.status(501).json({message:"Failed"});
    }
};

exports.getChat = async(req,res,next) => {

    const {id} = req.user;
    const {messageId} = req.params;
    const lastMessageId = parseInt(messageId);
    const currentId = id;
    const chats = await Chats.findAll({
        where: {
            id: {
                [Op.gt]: lastMessageId,
            }
        }
    });

    for(let chat of chats) {

        const {userId} = chat.dataValues;
        
        // if these message belongs to user on the client end
        // we set the isCurrent true
        // else false
        // we get data to UI accordingly

        if(userId === currentId){

            chat.dataValues = {...chat.dataValues, userId:null, isCurrent:'true'};
            chat. _previousDataValues = {...chat. _previousDataValues, userId:null, isCurrent:'true'};
        }
        else{
            chat.dataValues = {...chat.dataValues, userId:null, isCurrent:'false'};
            chat. _previousDataValues = {...chat. _previousDataValues, userId:null, isCurrent:'false'};
        }
    }
    return res.status(201).json({response : chats,message:'Succesfull'});
};