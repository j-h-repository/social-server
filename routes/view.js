import express from "express";
const router = express.Router();

import {requireSignin} from "../middlewares";
import {userPosts, totalPost} from "../controllers/post"
import {findPeople,  showFollowing, followAction, unfollowAction, searchUser, getUser} from "../controllers/people"

router.get("/user-posts", requireSignin, userPosts);
router.get("/find-people", requireSignin, findPeople);
router.put("/user-follow", requireSignin, followAction);
router.put("/user-unfollow", requireSignin, unfollowAction);


router.get("/user-following", requireSignin, showFollowing);

router.get("/total-posts", totalPost);

router.get("/search-user/:query", searchUser);
router.get("/user/:username", getUser);


module.exports=router;