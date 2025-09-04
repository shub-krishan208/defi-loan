import express from "express";
import { viewLedger, addEntry, findUser, updateDues } from "./db.js";

const router = express.Router();

router.post("/db", async (req, res) => {
  const { pid, user, amt, cibil, path } = req.body;
  console.log("Users:", viewLedger());
  addEntry(pid, user, amt, cibil, path);
  res.status(201).json({ message: "New Entry created successfully." });
});

router.post("/db/date", async (req, res) => {
  const { date, id } = req.body;
  updateDues(date, id);
  res.status(201).json({ message: "Date time updated." });
});

export default router;
