const jwt = require('jsonwebtoken')
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