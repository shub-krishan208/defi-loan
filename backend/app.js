import express from "express";
import cors from "cors";
import { viewLedger, addEntry, findUser, updateDues } from "./db";
import router from "./router";

const app = express();
const PORT = 3000;

app.use(cors({ origin: ["http://localhost:8080"] }));
app.use("/api", router);
