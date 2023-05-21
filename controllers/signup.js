const Users = require('../models/signup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helper = require('../util/helper');
require('dotenv').config();

exports.addUser = async (req,res,next) => {

    const {name} = req.body;
    const {email} = req.body;
    const {password} = req.body;
    const user = await Users.findOne( { where : {email : email} } );

    // checking validity of input values
    if( helper.isvalidString(name) && helper.isvalidString(email) && helper.isvalidString(password) ){
        
        // user exists or not
        if(!user) {
            bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), (err, salt) => {
                bcrypt.hash(password, salt, async (err, hashPass) => {
                    
                    // Store hash in your password DB
                    try{
                        const response = await Users.create({name:name, email:email, password:hashPass});
                        return res.status(201).json({success:response, message:'Successful'});
                    }
                    catch(err){
                        // error creating user
                        return res.status(501).json({message:'Failed'});
                    }
                });
            });
        }
        else{
            // user already exists
            return res.status(502).json({message:'Failed'});
        }
    }
    else{
        // invalid input
        return res.status(500).json({message:"Invalid Input !!"});
    }
};