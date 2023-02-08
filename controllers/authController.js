import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userCheck = await User.findOne({ email });
    if (userCheck)
      return res
        .status(401)
        .json({ status: false, msg: "Tài Khoản Đã Tồn Tại" });
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: passwordHash,
    });
    return res.status(200).json({ status: true, msg: "Đăng Kí Thành Công" });
  } catch (err) {
    next(err);
  }
};

export const Login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(404)
        .json({ status: false, msg: "Tài Khoản Hoặc Tài Khoản Không Tồn Tại" });
    const passwordCheck = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordCheck) {
      return res
        .status(404)
        .json({ status: false, msg: "Tài Khoản Hoặc Tài Khoản Không Tồn Tại" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT
    );
    const { password, ...more } = user._doc;
    res.status(200).json({
      ...more,
      token,
    });
  } catch (err) {
    next(err);
  }
};
