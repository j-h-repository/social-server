import User from "../models/users";
import { comparePassword } from "./rotate";
import jwt from "jsonwebtoken"
import { io } from "../server";

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if email exists in db//
    const user = await User.findOne({ email });
    if (!user)
      //return res.status(400).send("An account for this email does not exist");
      return res.json({error: "An account for this email does not exist"});

    //compare the password using the function from the rotate.js file//
    const match = await comparePassword(password, user.password);
    if (!match) return res.json({error: "Password or username is not correct"});

    //assign json web token//
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //hide password and secret
    user.password = undefined;
    user.secret = undefined;

    res.json({ user, token });
    return;
  } catch (err) {
    console.log(`error => ${err}`);
    return res.status(400).send("Error. Sign in failed. Try again.");
  }
};
