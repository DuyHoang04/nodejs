import express from "express";
import {
  addRemoveFollow,
  getAllUser,
  getUser,
  getUserFollower,
  getUserFollowing,
} from "../controllers/userController.js";
const router = express.Router();

router.get("/find/:id", getUser);
router.get("/", getAllUser);
router.get("/following/:id", getUserFollowing);
router.get("/follower/:id", getUserFollower);
router.post("/:id/:userFollowId", addRemoveFollow);

export default router;
