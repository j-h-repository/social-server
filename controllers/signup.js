import User from "../models/users";
import { hashPassword, comparePassword } from "./rotate";
import {uid} from "uid/secure"
import cloudinary from "cloudinary"

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
})

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, password2 } = req.body;

  if(!firstName) return res.json({error:"Please enter your first name"});
  if(!lastName) return res.json({error:"Please enter your last name"});
  if(!password || password.length < 8)
    return res.json({error: "Password required and must be 8 characters or more"});
  if(password !== password2) return res.json({error: "Passwords do not match"})
  const exist = await User.findOne({ email });
  if(exist) return res.json({error:"Email is already in use"});

  const hashedPassword = await hashPassword(password);
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    username: uid(7),
  });

  try {
    await user.save();
    console.log("registered user=> ", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log("registration failed: ", err);
    return res.status(400).send("Error. Registration failed. Try again.");
  }
};

export const updateProfile = async (req, res) => {
  console.log("triggered")
  console.log(req.auth)
  try {
    const data = {};
    if (req.body.username) {
      
      const exist = await User.findOne(req.auth.username);
      console.log("read username=>", req.body.username);
      if(exist.username == req.auth.username){
        console.log("already exists")
        console.log("existing username=>",exist.username)
        return res.json({error:`${req.body.username} is already in use`})
      } else{
        console.log("username passed");
        data.username = req.body.username;
      }
  
    }
    if(req.body.firstName){
      data.firstName = req.body.firstName
    } 
    if(req.body.lastName){
      data.lastName = req.body.lastName
    }
    if(req.body.about){
      data.about = req.body.about
    }
    if(req.body.image){
      data.image = req.body.image
    }
    // ........
    // Do this for the rest of the items sent
    // ***check for password length
    if (req.body.password) {
      if(req.body.password.length <8){
        return res.json({error:"Password must be longer than 8 characters"})
      }
      else if(req.body.password2){
        if(req.body.password != req.body.password2){
          return res.json({error: "Passwords must match"})
        } else{
          data.password = await hashedPassword(req.body.password);
        }
      } else{
        return res.json({error: "Enter your password again to match"})
      }
    }

    // ***after all of the data.variables are saved

    let user = await User.findByIdAndUpdate(req.auth._id, data, { new: true });
    user.password = undefined;
    console.log("end of function");
    res.json(user);
  } catch (err) {
    if (err.code == 11000) {
      
      return res.json({error:`This name is already in use`});
    }
  }
};


export const deleteImage = async (req, res) => {
  const {url} = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.auth._id);
    console.log(user)
    if (user && user.image.url) {
      const image = await cloudinary.uploader.destroy( user.image.url);
    }
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
}; 