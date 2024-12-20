const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const JWT_SECRET = process.env.jwt_SECRET_KEY;

const generateToken = async (userId) => {
  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET_KEY is not set in environment variables.");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h", // Token expiration
    });

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Secure flag for HTTPS
      maxAge: 3600000, // Cookie expiration (1 hour)
    });

    return token;
  } catch (err) {
    console.log("Error generating token:", err);
    throw err;
  }
};
