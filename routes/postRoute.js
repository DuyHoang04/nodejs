import express from "express";
import {
  cmtPost,
  createPost,
  getAllPost,
  getUserPost,
  likePost,
} from "../controllers/postController.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/", verifyToken, createPost);
router.get("/", getAllPost);
router.get("/:userId", getUserPost);
router.put("/like/:id", verifyToken, likePost);
router.put("/cmt/:id", verifyToken, cmtPost);
export default router;
