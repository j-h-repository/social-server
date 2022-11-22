import Message from "../models/message";
import User from "../models/users"

export const sendMessage = async (req, res)=> {
    const {receive, sent, message} = req.body;
    console.log(receive.firstName, sent.firstName)
    
    if(message.length<1){
       return res.json({"error":"you must type a message"})
    } 
    
    const from = await User.findById(sent._id)
    
    //console.log(from)
    const id = from.chats.filter(chat=>chat.other == receive._id)
    //console.log("person id=> ", id[0].other, "chat id=>", id[0].iden)
    //console.log("chat id=>", id[0].iden)

    const exist =  id && id[0] && id[0].iden
    
    // const exist = await Message.find({
    //   $and: [
    //     {people: {$in: sent._id}},
    //     {people: {$in: receive._id}}
    //   ],
    // });
        
    if(!exist){
        console.log("creating=>");
        const talk = new Message({people: [receive, sent], messages:[{message, sentBy:sent._id}]})
        talk.save();
        const one = await User.findByIdAndUpdate(sent, {
            $push: {chats: {iden: talk._id, other:receive._id}}
        }, {new:true})
        const two = await User.findByIdAndUpdate(receive, {
            $push: {chats: {iden: talk._id, other:sent._id}}
        }, {new:true})
       
        
        
    } else{
        console.log("updating =>")
        const update = await Message.findByIdAndUpdate(id[0].iden,{
               $push: {messages: [{message, sentBy:sent}]}, 
        })
        update.save();
    }
}


export const getMessage = async(req, res)=>{
    
    try{
        const user = await User.findById(req.auth._id);
      
	    let list  = user.chats.map(chat=>{
            return chat.iden
        });
        console.log(user.chats[0].iden)
        console.log("chats=>",list)
	   


    
        //create a post variable that holds the posts retrieved from the database
        const chats = await Message.find( {_id: {$in: list}} )
        .populate("people", "_id firstName lastName username image") //populate each post occurence with the id, name, and image
        // .populate("messages", "_id message sentBy created")
        .sort({updatedAt:-1})
        //sort the posts in chronological order, with the newest first
        //only upload 10 post maximum
        
        // const other = (chats.map(chat=>chat.people.filter(other => other._id != req.auth._id)))
        // console.log(other)
        // console.log("json=>",chats)
        res.json(chats); //send the posts to the front end in json format
       
    } catch(err){
        console.log(err)
    }
}