import mongoose from "mongoose";
const {Schema} = mongoose;
const { ObjectId } = mongoose.Schema;
		
const messageSchema = new Schema({
	
    people: [
       { type: Object},
],
     

    messages:[
        { 
            message: String, 
            created: { type: Date, default: Date.now }, 
            sentBy: { type: ObjectId, ref: "User" } 
        }
    ],


}, {timestamps:true})

export default mongoose.model('Message', messageSchema)
