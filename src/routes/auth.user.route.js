const express = require("express");
const router = express.Router();
const User = require("../model/user.model");
const generateToken = require("../middleware/generate.token");

// register new user

router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = new User({ email, password, username });
    await user.save();
    res.status(200).send({ message: "Registration Successfull", user: user });
  } catch (err) {
    console.log("Failed to register...", err);
    res.status(500).send({ message: "Registration Failed" });
  }
});

// login user

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "User Not Found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid Password" });
    }

    //generate token after login

    const token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
    res.status(200).send({
      message: "Login Successfull",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("Failed to Login...", err);
    res.status(500).send({ message: "Login Failed!" });
  }
});

// logout the user

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).send({ message: "Logout Successfully" });
  } catch (err) {
    console.log("Failed to logout...", err);
    res.status(500).json({ message: "Logout Failed!" });
  }
});

// get users

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "id email role");
    res.status(200).send({ message: "Users Found Successfully", users: users });
  } catch (err) {
    console.log("Failed to get users...", err);
    res.status(500).json({ message: "Failed! to Get user" });
  }
});

// delete a user

router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "user delete successfully" });
  } catch (err) {
    console.log("Failed to  delete user...", err);
    res.status(500).json({ message: "Failed! to delete user" });
  }
});

//update user's role

router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res
      .status(200)
      .send({ message: "User's role updated successfully", user: user });
  } catch (err) {
    console.log("Failed to update user's role...", err);
    res.status(500).json({ message: "Failed! to update user's role" });
  }
});

module.exports = router;
