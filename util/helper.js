const jwt = require('jsonwebtoken')
const sequelize = require('../util/database');
const Chats = require('../models/chats');
const ArchiveChats = require('../models/archiveChats');
require('dotenv').config();

// generate token access for user
exports.generatetokenAccess = (user) => {
    const userId = user;
    return jwt.sign({userId : userId}, process.env.ENCRYPTIONKEY);
};

// checking if the input is valid
exports.isvalidString = (str) => {
    if(str.length == 0 || str == undefined){
        return false;
    }
    else{
        return true;
    }
};

// cron function
exports.cronFunction = async() => {

    try {
        const chats = await Chats.findAll();
        const promisesArr = [];

        for(let chat of chats) {

            // creating temporary promise
            const tempPromise =  ArchiveChats.create({
                id: chat.id,
                chat: chat.chat,
                isImage: chat.isImage,
                groupId: chat.groupId,
                userId: chat.userId
            });
            // pushing promises in array
            promisesArr.push(tempPromise);
        }

        // checking if there are any promises in the array
        if(promisesArr.length) {
            await Promise.all(promisesArr)
            .then( () => {
                Chats.truncate()
            })
            .catch(err => console.log(err));
        }
    }
    catch(err) {
        console.log('Error moving data:', err);
    }
};