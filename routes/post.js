import express from "express";
const router = express.Router();
import formidable from "express-formidable"

import {requireSignin, canEditDelete} from "../middlewares";
import {createPost, uploadImage, editPost, updatePost, deletePost, postLike, postUnlike, addComment, deleteComment} from "../controllers/post"
import {sendMessage, getMessage} from "../controllers/message"

router.post("/create-post", requireSignin, createPost);
router.post("/upload-image", requireSignin, formidable({maxFileSize:10*1024*1024}), uploadImage);
router.get("/user-posts/:_id", requireSignin, canEditDelete, editPost);
router.put(`/update-post/:_id`, requireSignin, updatePost);
router.delete("/delete-post/:_id", requireSignin, canEditDelete, deletePost);

router.put("/post-like", requireSignin, postLike);
router.put("/post-unlike", requireSignin, postUnlike);

router.put("/add-comment", requireSignin, addComment);
router.put("/delete-comment", requireSignin, deleteComment);


router.post("/send-message", requireSignin, sendMessage)
router.get("/messages", requireSignin, getMessage)


module.exports=router;