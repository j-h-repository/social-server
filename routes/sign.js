import express from "express";
const router = express.Router();
import {deleteImage, signup, updateProfile} from "../controllers/signup";
import {signin} from "../controllers/signin";
import {requireSignin} from "../middlewares";
import {currentUser} from "../controllers/auth"

router.post("/signup",signup)
router.post("/signin", signin)
router.get("/current-user", requireSignin, currentUser);
router.put("/update-profile", requireSignin, updateProfile);
router.put("/delete-image", requireSignin, deleteImage)

module.exports=router;