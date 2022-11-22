import mongoose from "mongoose";
const {Schema} = mongoose;
		
const userSchema = new Schema({
	firstName:{type:String, trim:true, required:true,},
	lastName:{type:String, trim:true, required:true,},
    email:{type:String, required:true,min:8, max:25,},
    password:{type:String, trim:true, required:true,},
    about:{},
    username: {type: String,unique:true, required: true},
    image: { url: String, public_id: String },
    following:[{type:Schema.ObjectId, ref:"User"}],
    followers:[{type:Schema.ObjectId,ref:"User"}],
    chats: [{
            iden:{type:Schema.ObjectId,ref:"Message"}, 
            other:{type:Schema.ObjectId, ref:"User"}
        }
    ]

}, {timestamps:true})

export default mongoose.model('User', userSchema)
