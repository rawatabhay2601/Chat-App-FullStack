const Groups = require('../models/groups');
const Users = require('../models/users');
const sequelize = require('../util/database');
const { Op } = require('sequelize');
require('dotenv').config();

// adding groups
exports.addGroups = async(req,res,next) => {

    // name of the group is taken from the frontend
    const {name} = req.body;
    const {id} = req.user;
    const adminId = parseInt(id);

    try {
        // creating new groups
        const group = await req.user.createGroup({name:name, adminId:adminId});

        // returning the response after creating the group
        return res.status(201).json({data: group});
    }
    catch(err) {
        return res.status(501).json({message:'Failed'});
    }
};

// adding user to the group
exports.addUserToGroup = async (req,res,next) => {

    // user id of the current user
    const {id} = req.user;
    const {groupId} = req.body;
    const {userEmail} = req.body;
    const t = await sequelize.transaction();

    // selecting a particular group
    try {

        // checking if the current user is admin or not
        const isAdmin = await Groups.findOne({where: {adminId:id, id:groupId}});
        if(isAdmin) {

            // selecting groups and users
            const group = Groups.findOne({where: {id : groupId}});
            const user = Users.findOne({where: {email : userEmail}});
            const ifUserExists = Users.findOne({
                include: {
                    model: Groups,
                    where: {
                        id: groupId
                    }
                },
                where: {
                    email: userEmail
                }
            });
                        
            // sending both the promises together
            const [resGroup, resUser, recExists] = await Promise.all([group, user, ifUserExists]);
            
            // checking if record already exists or not
            if(recExists) {
                await t.rollback();
                return res.status(503).json({ message:'User is already in the group !!'});
            }
    
            // checking an exception when email id is wrong
            if(!resUser) {
                await t.rollback();
                return res.status(502).json({ message: 'Such user does not exists !!'});
            }
            
            // adding user to the group
            await resUser.addGroup(resGroup, {transaction : t});
    
            // committing the changes
            await t.commit();
            return res.status(201).json({resGroup : resGroup, resUser: resUser, recExists : recExists});
        }
        else{
            t.rollback();
            return res.status(504).json({message: 'Only admin can add user in the group !!'});
        }
    }
    catch(err) {
        // await t.rollback();
        console.log(err);
        return res.status(501).json({message:'Failed'});
    }
};

// removing user from the group
exports.removeUserFromGroup = async (req,res,next) => {

    // user id of the current user
    const {id} = req.user;
    const {groupId} = req.body;
    const {userEmail} = req.body;
    const t = await sequelize.transaction();

    // selecting a particular group
    try {

        // checking if the current user is admin or not
        const isAdmin = await Groups.findOne({where: {
            [Op.and]: [
                { adminId:id },
                { id:groupId }
            ]}
        });

        // if admin user is making the request or not
        if(isAdmin) {

            // selecting groups and users
            const group = Groups.findOne({where: {id : groupId}});
            const user = Users.findOne({where: {email : userEmail}});
            const ifUserExists = Users.findOne({
                include: {
                    model: Groups,
                    where: {
                        id: groupId
                    }
                },
                where: {
                    email: userEmail
                }
            });
                        
            // sending both the promises together
            const [resGroup, resUser, recExists] = await Promise.all([group, user, ifUserExists]);
            
            // checking an exception when email id is wrong
            if(!resUser) {
                await t.rollback();
                return res.status(502).json({ message: 'Such user does not exists !!'});
            }

            // checking if record already exists or not
            if(!recExists) {
                await t.rollback();
                return res.status(503).json({ message:'User is not in the group !!'});
            }
            
            // adding user to the group
            await resUser.removeGroup(resGroup, {transaction : t});
    
            // committing the changes
            await t.commit();
            return res.status(201).json({resGroup : resGroup, resUser: resUser, recExists : recExists});
        }
        else {
            t.rollback();
            return res.status(504).json({message: 'Only admin can remove user from the group !!'});
        }
    }
    catch(err) {
        await t.rollback();
        console.log(err);
        return res.status(501).json({message:'Failed'});
    }
};

// get groups names
exports.getGroups = async (req,res,next) => {

    try{
        // current user id
        const {id} = req.user;
    
        // Find the groupName
        const groupNames = await Groups.findAll({
            attributes: ['name','id'],
            include: [
                {
                    model: Users,
                    where: { id: id },
                    attributes: []
                }
            ]
        });

        
        return res.status(200).json({ response:groupNames });
    }
    catch(err) {
        return res.status(501).json({message:'Failed', error: err})
    }
};