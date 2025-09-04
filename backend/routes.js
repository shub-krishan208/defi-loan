import express from "express";
import { makeUser, addColl, viewLedger, findUser } from "./db.js";
import { login } from "./auth/authController.js";
import { guard } from "./auth/guard.js";

const router = express.Router();

// auth routes

router.post("/login", login);
router.get("/check", guard);

// add new user
router.post("/db/new", async (req, res) => {
  const { pid, name, cibil } = req.body;
  console.log(
    `Adding user into db, \n address: ${pid} \n name: ${name} \n cibil: ${cibil}`
  );
  makeUser(pid, name, cibil);
  res.status(201).json({ message: "New User created successfully." });
});

// view the database as a whole
router.get("/db/view", async (req, res) => {
  try {
    const ledger = viewLedger();
    res.status(200).json(ledger);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving ledger data", error: error });
  }
});

// search for a user in the db
router.get("/db/user/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const user = findUser(username);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error retrieving user data", error: err });
  }
});

//request for the processing of user profile and returning the collateral amount
router.get("/process-id", async (req, res) => {
  const { cibil } = req.body;
  console.log(`evaluating user eligibility...`);
  // function call to ml
  const max_loan = 1000000; // dummy value
  res.status(200).json({ max_loan: max_loan });
});

// get collateral value from the backend
router.get("/coll-value", async (req, res) => {
  const { amt } = req.body;
  // some logic to calculate the collateral value
  const coll_value = amt * 1.5;
  res.status(200).json({ coll_value: coll_value });
});

export default router;
