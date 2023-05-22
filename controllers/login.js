const Users = require('../models/users');
const bcrypt = require('bcrypt');
const helper = require('../util/helper');
require('dotenv').config();

exports.loginUser = async (req,res,next) => {

    // GETTING DATA FROM THE FRONTEND
    const {email} = req.body;
    const {password} = req.body;
    
    // CHECKING IF A USER WITH THE EMAIL IN FRONTEND EXISTS
    let response;
    try{
        response = await Users.findOne({
            where : {email:email}
        });

        // password and ID of the user
        const encyptPassword = response.dataValues.password;
        const {id} = response.dataValues;

        // matching entered password and stored password
        bcrypt.compare(password, encyptPassword, (error, result) => {

            // IF PASSWORDS IS CORRECT 
            if(result){
                return  res.status(201).json({message:"User Login Successfully !!" , token: helper.generatetokenAccess(id)});
            }
            // IF PASSWORDS IS INCORRECT
            else{
                return res.status(401).json({message:"Incorrect Password !!"});
            }
        })
    }
    // IF NO SUCH USER EXISTS
    catch(err){
        return res.status(404).json({message: "No Such User Exists !!"});
    }

    
};