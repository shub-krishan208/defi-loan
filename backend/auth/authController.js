import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findUser } from "./user.js";

const login = async (req, res) => {
  const { username, password } = req.body;
  const JWT_SECRET =
    "a_very_long_string_that_is_supposed_to_be_a_super_secret_for_JWT_encryption";
  try {
    const admin = findUser(username);
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const payload = {
      id: admin.id,
      username: admin.username,
    };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "3h", //token expires in 3h
    });

    res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
    });
  } catch (err) {
    console.log("Error while logging in: ", err);
  }
};

export { login };
