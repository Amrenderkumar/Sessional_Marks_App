import express from 'express';
import { registerUser, loginUser, getUser, logoutUser, forgetPassword, resetPassword } from '../contollers/auth.controller.js';


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getUser);
router.get("/logout", logoutUser);
router.get("/password/forget", forgetPassword);
router.post("/password/reset/:token", resetPassword);


export default router;