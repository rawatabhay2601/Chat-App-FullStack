const Chats = require('../models/chats');
const services = require('../services/s3');
require('dotenv').config();

exports.addChat = async (req,res,next) => {
    const {chat} = req.body;
    const {groupId} = req.body;

    // taking care of groupId
    let groupIdChanged = groupId;
    if(groupId == '0')  groupIdChanged = null;

    try {
        const response = await req.user.createChat({chat:chat, groupId:groupIdChanged});
        response.dataValues = {...response.dataValues, userId:null,isCurrent:'true'}; 
        
        return res.status(201).json({message:"Successful", response:response});
    }
    catch(err) {
        return res.status(501).json({message:"Failed",error:err});
    }
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

exports.uploadImage = async(req,res,next) => {

    const fileName = `${req.user.name}+${JSON.stringify(new Date())}.jpg`;
    const files = req.files.image;

    // const fileStream = fs.createReadStream(files.tempFilePath);
    const imageBuffer = Buffer.from(files.data, 'base64');

    const params = {
        Bucket: 'chatapp-abhay',
        Key: fileName,
        Body: imageBuffer,
        ACL:"public-read"
    };

    // Upload the image to S3
    try{
        const link = await services.uploadImageToS3(params);
        return res.status(201).json({data:link});
    }
    catch(err){
        console.log(err);
        return res.status(501);
    }
    
};

exports.addImage = async (req,res,next) => {
    const {chat} = req.body;
    const {groupId} = req.body;

    // taking care of groupId
    let groupIdChanged = groupId;
    if(groupId == '0')  groupIdChanged = null;

    try {
        const response = await req.user.createChat({chat:chat, groupId:groupIdChanged, isImage:true});
        response.dataValues = {...response.dataValues, userId:null,isCurrent:'true'};
        
        return res.status(201).json({message:"Successful", response:response});
    }
    catch(err) {
        return res.status(501).json({message:"Failed",error:err});
    }
};