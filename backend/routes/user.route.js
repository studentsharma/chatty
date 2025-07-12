import express from "express";
import { createUser, getFriends, getUsers, login, logout } from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";
import authme from "../controllers/authme.controller.js"


const router = express.Router();

router.get("/get-user", auth, getUsers)
router.post("/register-user", createUser)
router.post("/login", login)
router.get("/me", authme)
router.get("/logout", logout)

export default router;