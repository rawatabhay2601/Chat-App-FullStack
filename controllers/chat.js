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