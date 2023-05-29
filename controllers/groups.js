const Groups = require('../models/groups');
const Users = require('../models/users');
const sequelize = require('../util/database');

exports.addGroups = async (req,res,next) => {

    // name of the group is taken from the frontend
    const {name} = req.body;
    try{
        // creating new groups
        const group = await req.user.createGroup({name:name});
        // returning the response after creating the group
        return res.status(201).json({data: group});
    }
    catch(err){
        console.log(err);
        return res.status(501).json({message:'Failed'});
    }
    
};

exports.addUserToGroup = async (req,res,next) => {

    // user id of the current user
    const {id} = req.user;
    console.log(':::::::::::::::::::::::::::::::',id);
    const {groupId} = req.body;
    const {userEmail} = req.body;
    const t = await sequelize.transaction();

    // selecting a particular group
    try {
        // checking if the current user is part of the group or not
        const isCurrentUser = await Users.findOne({
            include: {
                model: Groups,
                where: {
                    id: groupId
                }
            },
            where: {
                id: id
            }
        });
        
        console.log('Current User Id :::::::::::::::::::',isCurrentUser);
        
        if(isCurrentUser) {

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
            const [resGroup, resUser, recExists]  = await Promise.all([group, user, ifUserExists]);
            
            // checking if record already exists or not
            if(recExists) {
                await t.commit();
                return res.status(503).json({ message:'User is already in the group !!'});
            }
    
            // checking an exception when email id is wrong
            if(!resUser) {
                await t.commit();
                return res.status(502).json({ message: 'Such user does not exists !!'});
            }
            
            // adding user to the group
            await resUser.addGroup(resGroup);
    
            // committing the changes
            await t.commit();
            return res.status(201).json({resGroup : resGroup, resUser: resUser, recExists : recExists});
        }
        else{
            t.commit();
            return res.status(504).json({message: 'User does have permission as not part of the group !!'});
        }

    }
    catch(err) {
        console.log(err);
        await t.rollback();
        return res.status(501).json({message:'Failed', error: err});
    }
};

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

        
        return res.status(200).json({response: groupNames});
    }
    catch(err) {
        return res.status(501).json({message:'Failed', error: err})
    }
};