const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();

// Use Render's assigned port, or fall back to 8080
const port = process.env.PORT || 8080;

// Routes
const contactRoutes = require("./src/routes/contactForm");
const blogRoutes = require("./src/routes/blog.route");
const commentsRoutes = require("./src/routes/comment.route");
const userRoutes = require("./src/routes/auth.user.route");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // Update this with your frontend URL for production
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

// Using routes
app.use("/api/auth", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api", contactRoutes);

// Database connection
async function main() {
  await mongoose.connect(process.env.MongoDB_URL);
}

main()
  .then(() => {
    console.log("Database is connected Successfully...");
  })
  .catch((err) => {
    console.log("Error connecting to database...", err);
  });

// Home route
app.get("/", (req, res) => {
  res.send("Hey Developer ✔");
});

// Start server, binding to '0.0.0.0' to be accessible externally
app.listen(port, "0.0.0.0", () => {
  console.log(`App is listening on port ${port}...`);
});
