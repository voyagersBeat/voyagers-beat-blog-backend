const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const JWT_SECRET = process.env.jwt_SECRET_KEY;

const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  } catch (err) {
    console.log("Error to generative token...", err);
    throw err;
  }
};

module.exports = generateToken;
