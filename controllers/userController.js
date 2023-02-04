import User from "../model/user.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, age } = req.body;
    const newUser = await User.create({
      name,
      age,
    });
    res.status(200).json(newUser);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
