const express = require("express");
const Blog = require("../model/blog.model");
const Comment = require("../model/comment.model");
const verifyToken = require("../middleware/verify.token");
const isAdmin = require("../middleware/isAdmin");
const router = express.Router();

// create blog post route

router.post("/create-post", verifyToken, isAdmin, async (req, res) => {
  try {
    const newPost = new Blog({ ...req.body, author: req.userId });
    await newPost.save();
    res.status(201).send({
      message: "Post Create Successfully",
      post: newPost,
    });
  } catch (err) {
    console.log("error to create a post...", err);
    res.status(500).send({ message: "Error to Create a New Post" });
  }
});

// all blogs route

router.get("/", async (req, res) => {
  try {
    const { search, category, location } = req.query;
    console.log(search);

    let query = {};

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (category) {
      query = {
        ...query,
        category: category,
      };
    }

    if (location) {
      query = {
        ...query,
        location: location,
      };
    }

    const post = await Blog.find(query)
      .populate("author", "email")
      .sort({ createdAt: -1 });
    res.status(200).send(post);
  } catch (err) {
    console.log("error to Retrieve post...", err);
    res.status(500).send({ message: "Error to Retrieve Post" });
  }
});

// get only single blog route

router.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "Post Not Found" });
    }
    const comments = await Comment.find({ postId: postId }).populate(
      "user",
      "username email"
    );
    res.status(200).send({
      post,
      comments,
    });
  } catch (err) {
    console.log("error to Retrieve this post...", err);
    res.status(500).send({ message: "Error to Retrieve this Post" });
  }
});

// update the posts

router.patch("/update-post/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await Blog.findByIdAndUpdate(
      postId,
      {
        ...req.body,
      },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).send({ message: "Post Not Found" });
    }
    res.status(200).send({
      message: "Post update successfully",
      post: updatedPost,
    });
  } catch (err) {
    console.log("error to Update this post...", err);
    res.status(500).send({ message: "Error to Update this Post" });
  }
});

// delete blog route

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Blog.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).send({ message: "Post Not Found" });
    }
    // delete comment when delete the post
    await Comment.deleteMany({ postId: postId });
    res.status(200).send({
      message: "Post deleted successfully",
      post: post,
    });
  } catch (err) {
    console.log("error to delete this post...", err);
    res.status(500).send({ message: "Unable to Delete this Post" });
  }
});

//related blogs

router.get("/related/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "Post Id is required" });
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send({ message: "Post id not Found" });
    }
    const titleRegex = new RegExp(blog.title.split(" ").join("|"), "i");
    const relatedQuery = {
      _id: { $ne: id },
      title: { $regex: titleRegex },
    };
    const relatedPost = await Blog.find(relatedQuery);
    res.status(200).send(relatedPost);
  } catch (err) {
    console.log("error to delete Fetch related post...", err);
    res.status(500).send({ message: "Unable to Fetch related this Post" });
  }
});

module.exports = router;
