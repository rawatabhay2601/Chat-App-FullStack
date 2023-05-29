const Chats = require('../models/chats');
const {Op} = require('sequelize');

exports.addChat = async (req,res,next) => {
    const {chat} = req.body;
    const {groupId} = req.body;

    try{

        const response = await req.user.createChat({chat:chat,groupId: groupId});
        
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
    const {lastMsgId} = req.query;
    const {groupId} = req.query;
    const lastMessageId = parseInt(lastMsgId);
    let groupID = parseInt(groupId);
    const currentId = id;
    
    // for free chat    
    if(groupID === 0) groupID = null;
    const chats = await Chats.findAll({
        where: {
            id: {
                [Op.gt]: lastMessageId,
            },
            groupId : groupID
        }
    });
    for(let chat of chats) {

        const {userId} = chat.dataValues;
        
        // if these message belongs to user on the client end
        // we set the isCurrent true
        // else false
        // we get data to UI accordingly

        if(userId === currentId) {

            chat.dataValues = {...chat.dataValues, userId:null, isCurrent:'true'};
        }
        else {
            chat.dataValues = {...chat.dataValues, userId:null, isCurrent:'false'};
        }
    }
    return res.status(201).json({response : chats, message:'Successful'});
};

exports.getLastChat = async(req,res,next) => {

    try {
        const {groupId} = req.query;
        const {id} = req.user;
        let groupIdInt = parseInt(groupId);

        // expectional case for free chat group
        if(groupIdInt === 0) groupIdInt = null;

        const groupChats = await Chats.findAll({where: {groupId : groupIdInt}});

        // checking if the users is the current user or not
        for(let chat of groupChats) {

            const {userId} = chat.dataValues;
            
            // if these message belongs to user on the client end
            // we set the isCurrent true
            // else false
            // we get data to UI accordingly
    
            if(userId === id) {
                chat.dataValues = {...chat.dataValues, userId:null, isCurrent:'true'};
            }
            else {
                chat.dataValues = {...chat.dataValues, userId:null, isCurrent:'false'};
            }
        }
        return res.status(201).json({ response:groupChats });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message:'Failed',error :err });
    }
};