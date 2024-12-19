const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT || 8080;
const contactRoutes = require("./src/routes/contactForm");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Add PATCH here
    credentials: true,
  })
);

//console.log(process.env.MongoDB_URL);

// All voyagers blog route

const blogRoutes = require("./src/routes/blog.route");
const commentsRoutes = require("./src/routes/comment.route");
const userRoutes = require("./src/routes/auth.user.route");

app.use("/api/auth", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api", contactRoutes);

async function main() {
  await mongoose.connect(process.env.MongoDB_URL);
}

main()
  .then(() => {
    console.log("Database is connected Successfully...");
  })
  .catch((err) => {
    console.log("error to connect database...", err);
  });

app.get("/", (req, res) => {
  res.send("Hey Developer ✔");
});

app.listen(process.env.PORT || 8080, "0.0.0.0", () => {
  console.log(`App is listening on port ${process.env.PORT || 8080}...`);
});
