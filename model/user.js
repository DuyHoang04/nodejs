import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    age: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userModel);

export default User;
