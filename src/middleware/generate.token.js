const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const JWT_SECRET = process.env.jwt_SECRET_KEY;

const generateToken = async (userId) => {
  try {
    // Check if JWT_SECRET is available
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET_KEY is not set in environment variables.");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h", // Set token expiry as 1 hour
    });

    return token;
  } catch (err) {
    console.log("Error to generate token:", err);
    throw err;
  }
};

module.exports = generateToken;
