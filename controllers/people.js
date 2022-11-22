import User from "../models/users";

export const findPeople = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    let following = user.following;
    following.push(user._id);

    const people = await User.find({ _id: { $nin: following } })
      .select("-password")
      .limit(10);

    res.json(people);
  } catch (err) {
    console.log(err);
  }
};



export const followAction = async (req, res) => {
  try {
    const theFollowed = await User.findByIdAndUpdate(
      req.body._id,
      { $addToSet: { followers: req.auth._id } },
      { new: true }
    ).select("-password");

    const theFollowing = await User.findByIdAndUpdate(
      req.auth._id,
      { $addToSet: { following: theFollowed._id } },
      { new: true }
    ).select("-password");
    res.json(theFollowing);
  } catch (err) {
    console.log(err);
  }
};

export const unfollowAction = async (req, res) => {
  try {
    const theFollowed = await User.findByIdAndUpdate(
      req.body._id,
      { $pull: { followers: req.auth._id } },
      
    ).select("-password");

    const theFollowing = await User.findByIdAndUpdate(
      req.auth._id,
      { $pull: { following: req.body._id } },
      { new: true }
    ).select("-password");
    res.json(theFollowing);
  } catch (err) {
    console.log(err);
  }
};

export const showFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    let following = user.following;

    const people = await User.find({ _id: { $in: following } })
      .select("-password")
      .limit(10);

    res.json(people);
  } catch (err) {
    console.log(err);
  }
  }

  export const searchUser = async (req, res) => {
    const { query } = req.params;
 
    if (!query) return;
    try {
      const user = await User.find({
        $or: [
          { firstName: { $regex: query, $options: "i",  } },
          { lastName: { $regex: query, $options: "i",  } },
          { username: { $regex: query, $options: "i", } },
        ],
      }).select("_id username firstName lastName image");
      res.json(user);
    } catch (err) {
      console.log(err);
    }
  };
  
  export const getUser = async (req, res) => {
		try{
			const user = await User.findOne({username: req.params.username})
					.select("-password");
			res.json(user)
} catch(err){
	console.log(err)
}
}
