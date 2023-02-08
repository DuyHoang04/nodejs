import User from "../model/userModel.js";

// GET USER
export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("postArray");
    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getAllUser = async (req, res, next) => {
  try {
    console.log("vo");
    var activePage = +req.query._page || 1;
    var limit = +req.query._limit || 5;
    var queryName = req.query.q;

    if (queryName && activePage && limit) {
      const totalRecord = await User.find({
        $or: [{ name: { $regex: queryName } }],
      }).countDocuments();
      // =======SEARCH PHÂN TRANG==========
      console.log("Vao day ne");
      const totalPage = Math.ceil(totalRecord / limit);
      const startIndex = (activePage - 1) * limit;
      // Tạo ra studentList phân trang
      const userList = {};

      userList.totalStudent = totalRecord;
      userList.totalPage = totalPage;
      userList.activePage = activePage;

      // tìm kiếm theo tên
      userList.users = await User.find({
        $or: [{ name: { $regex: queryName } }],
      })
        .limit(limit)
        .skip(startIndex)
        .exec();

      return res.status(200).json(userList);
    }
    return res.status(200).json("");
  } catch (err) {
    next(err);
  }
};

// GET FOLLOWING
export const getUserFollowing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const following = await Promise.all(
      user.following.map((id) => User.findById(id))
    );

    const formatFollowing = following.map(
      ({ _id, firstName, lastName, occupation, location }) => {
        return { _id, firstName, lastName, occupation, location };
      }
    );

    res.status(200).json(formatFollowing);
  } catch (err) {
    next(err);
  }
};

// GET FOLLOWER
export const getUserFollower = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const follower = await Promise.all(
      user.follower.map((id) => User.findById(id))
    );

    const formatFollower = follower.map(
      ({ _id, firstName, lastName, occupation, location }) => {
        return { _id, firstName, lastName, occupation, location };
      }
    );

    res.status(200).json(formatFollower);
  } catch (err) {
    next(err);
  }
};

// ADD AND REMOVE FOLLOW
export const addRemoveFollow = async (req, res, next) => {
  try {
    const { id, userFollowId } = req.params;
    const user = await User.findById(id);
    const userFollow = await User.findById(friendId);

    // REMOVE FOLLOW
    if (user.following.includes(userFollowId)) {
      user.following = user.following((id) => id !== userFollowId); // xóa id đó trong list-đang theo dõi cuả mình
      userFollow.follower = userFollow.follower((id) => id !== id); // xóa id của mình trong list-theo dõi cuả họ
    } else {
      //REMOVE
      user.following.push(friendId);
      userFollow.follower.push(id);
    }
    //SAVE DATA
    await user.save();
    await userFollow.save();

    res.status(200).json("SUCCESS");
  } catch (err) {
    next(err);
  }
};
