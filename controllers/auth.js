import User from "../models/users";

export const currentUser= async(req,res)=>{ //console.log(req.auth);

    try{
        const user = await User.findById(req.auth._id);
        res.json({ok:true});
    }
    catch(err){console.log(err); res.sendStatus(400);}	
};
