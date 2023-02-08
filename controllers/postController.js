import Post from "../model/postModel.js";
import User from "../model/userModel.js";

export const createPost = async (req, res, next) => {
  try {
    const { description } = req.body;
    let imgArray = [];
    req.files.forEach((item) => {
      const file = {
        filePath: item.path,
      };
      imgArray.push(file);
    });
    const newPost = await Post.create({
      userId: req.user.id,
      description,
      picturePath: imgArray,
      likes: {},
    });

    if (newPost._id) {
      const user = await User.findById(req.user.id);
      await user.updateOne({ $push: { postArray: newPost._id } });
    }
    res.status(200).json(newPost);
  } catch (err) {
    next(err);
  }
};

// get tất cả bài post
export const getAllPost = async (req, res, next) => {
  try {
    const allPost = await Post.find().populate("userId");
    res.status(200).json(allPost);
  } catch (err) {
    next(err);
  }
};

// get các bài post của user
export const getUserPost = async (req, res, next) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const allPost = await Post.find({ userId }).populate("userId");
    res.status(200).json(allPost);
  } catch (err) {
    next(err);
  }
};

// UPDATE

export const likePost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatePost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatePost);
  } catch (err) {
    next(err);
  }
};

export const cmtPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    const post = await Post.findById(id);

    console.log(post);
    if (post) {
      const commentPost = {
        comment,
        user: userId,
      };
      post.comments.push(commentPost);
      post.numComments = post.comments.length;
    }

    await post.save();
    res.status(200).json({ error: false, msg: "Comment Success" });
  } catch (err) {
    next(err);
  }
};
