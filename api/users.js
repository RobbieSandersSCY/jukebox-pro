import express from "express";
const router = express.Router();
export default router;

import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

//post register
router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    const token = createToken({ id: user.id });
    res.status(201).send(token);
  },
);

// post login
// req needs a body
router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    // getUserByUserPass to verify req
    const user = await getUserByUsernameAndPassword(username, password);
    // no user - err
    if (!user) return res.status(400).send("Invalid Username or Password");
    // good user make token
    const token = createToken({ id: user.id });
    // send token
    res.send(token);
  },
);
