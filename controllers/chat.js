const Chats = require('../models/chats');
const helper = require('../util/helper');

exports.addChat = async (req,res,next) => {
    const {chat} = req.body;
    
    try{
        await req.user.createChat({chat:chat});
        return res.status(201).json({message:"Successful"});
    }
    catch(err){
        return res.status(501).json({message:"Failed"});
    }
};

exports.getChat = async(req,res,next) => {

    const {id} = req.user;
    const currentId = id;
    const chats = await Chats.findAll();

    for(let chat of chats){

        const {userId} = chat.dataValues;
        
        // if these message belongs to user on the client end
        // we set the isCurrent true
        // else false
        // we get data to UI accordingly
         
        if(userId === currentId){

            chat.dataValues = {...chat.dataValues,id:null,isCurrent:'true'};
            chat. _previousDataValues = {...chat. _previousDataValues,id:null,isCurrent:'true'};
        }
        else{
            chat.dataValues = {...chat.dataValues,id:null,isCurrent:'false'};
            chat. _previousDataValues = {...chat. _previousDataValues,id:null,isCurrent:'false'};
        }
    }
    return res.status(201).json({response : chats,message:'Succesfull'});
};