import express from "express";
const router = express.Router();
import { createUser, getUser } from "../controllers/userController.js";

router.post("/", createUser);
router.get("/", getUser);

export default router;
