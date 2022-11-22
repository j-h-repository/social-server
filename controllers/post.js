import Post from "../models/post"
import User from "../models/users"
import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})

export const createPost = async (req,res)=>{
    const {content, image} = req.body;
    if(!content.length) return res.json({error:"Content is required to post"});
    try{
        const post = new Post({content, image, postedBy: req.auth._id});
        post.save();
        res.json(post);
    }catch(err){
        console.log(err);
    }
}

export const uploadImage = async (req, res) => {
    // console.log(req.auth);
    // console.log(req.files);
    try{
        
        const location = await cloudinary.uploader.upload(req.files.image.path);
        console.log(location);
        res.json({url:location.secure_url, pulic_id:location.public_id});
    }catch(err){
        console.log(err);
    }  
}

export const userPosts = async (req, res) => {
    try{
        const user = await User.findById(req.auth._id);
	    let following = user.following;
	    following.push(req.auth._id);
        //add pagination below
        // currentPage = req.params.page || 1;
        // const perPage = 4; //or any desired number
        
        //create a post variable that holds the posts retrieved from the database
        const posts = await Post.find( {postedBy: {$in: following}})
        .populate("postedBy", "_id firstName lastName image username") //populate each post occurence with the id, name, and image
        .populate("comments.postedBy", "_id firstName lastName image")
        .sort({createdAt: -1})//sort the posts in chronological order, with the newest first
        .limit(10);//only upload 10 post maximum
      
        res.json(posts); //send the posts to the front end in json format
    } catch(err){
        console.log(err)
    }

}



export const editPost = async (req, res) => {
    try{
        const post = await Post.findById(req.params._id);
        res.json(post);
    } catch(err){
        console.log(err);
    }
    
}

export const updatePost = async (req, res) => {
    try{
        const post = await Post.findByIdAndUpdate(req.params._id, req.body, {new:true})
        res.json({ok:true});
    } catch(err){
        console.log(err)
    }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params._id);
    if (post.image && post.image.public_id) {
      const image = await cloudinary.uploader.destroy(post.image.public_id);
    }
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
}; 

export const postLike = async (req, res) => {
    console.log(req.body)
    try{
        const post = await Post.findByIdAndUpdate(req.body, 
            {$addToSet: {likes: req.auth._id}},
            {new: true}
            );
        res.json(post);
    } catch(err){
        console.log(err);
    }
}

export const postUnlike = async (req, res) => {
    console.log(req.body)
    try{
        const post = await Post.findByIdAndUpdate(req.body, 
            {$pull: {likes: req.auth._id}},
            {new: true}
            );
        res.json(post);
    } catch(err){
        console.log(err);
    }
}


export const addComment = async (req, res) =>{
    // console.log(req.body)
    // console.log(req.auth)
    try{
        const {postId, comment} = req.body;
        if(comment.length<5) return res.json({error: "Comment must be more than 5 characters long"})
        const user = await User.findById(req.auth._id)
        // console.log("USER=>", user)
        const post = await Post.findByIdAndUpdate(postId,{
            $push : {comments: {text: comment, postedBy: user}}
        },{new:true}
         )//.populate("postedBy", "_id firstName lastName image")
        .populate("comments.postedBy", "_id firstName lastName image");
        
        res.json(post)
    } catch(err){
        console.log(err)
    }
}

export const deleteComment = async (req, res) =>{
    try{
        const {postId, comment} = req.body;
        const post = await Post.findByIdAndUpdate(postId,{
            $pull : {comments: {text: comment}}
        },{new:true}
        );
       res.json(post)
    } catch(err){
       res.json({error:"Comment could not be removed"})
    }
}


export const totalPost = async(req, res)=> {
    try{
        const total = await Post.findOne().estimatedDocumentCount();
        console.log(total)
        res.json(total)
        //we will use this number to enable pagination on the front end
    } catch(err){
        console.log(err)
    }
    }
    