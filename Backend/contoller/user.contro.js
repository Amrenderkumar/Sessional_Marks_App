import express from "express";

const router = express.Router();

import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from "../service/user.service.js";


// Create a new user

router.post("/users", async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  }
    catch (error) {
    res.status(500).json({ error: error.message });
    }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});