import express from "express";
import { viewLedger, addEntry, findUser } from "./db.js";

const router = express.Router();

router.post("/db", async (req, res) => {
  const { pid, user, amt, cibil, path } = req.body;
  console.log("Users:", viewLedger());
  addUser(pid, user, amt, cibil, path);
  res.status(201).json({ message: "New Entry created successfully." });
});

export default router;
