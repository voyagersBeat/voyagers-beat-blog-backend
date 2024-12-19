const express = require("express");
const Comment = require("../model/comment.model");

const router = express.Router();

// comments

router.post("/post-comment", async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const { comment, postId, user } = req.body;

    // Validate that all required fields are present
    if (!comment || !postId || !user) {
      return res
        .status(400)
        .send({ message: "All fields (comment, postId, user) are required." });
    }

    // Create a new comment with validated fields
    const newComment = new Comment({ comment, postId, user });

    await newComment.save();
    res
      .status(200)
      .send({ message: "Comment created successfully", comment: newComment });
  } catch (err) {
    console.log("Error adding the comment:", err);
    res.status(500).send({
      message: "Unable to add the comment on this post",
      error: err.message,
    });
  }
});

// get and count all comments

router.get("/total-comments", async (req, res) => {
  try {
    const totalComments = await Comment.countDocuments({});
    res
      .status(200)
      .send({ message: "Total comments count", totalComments: totalComments });
  } catch (err) {
    console.log("error to count the comments on this post...", err);
    res
      .status(500)
      .send({ message: "Unable to count the comments on this Post" });
  }
});

module.exports = router;
