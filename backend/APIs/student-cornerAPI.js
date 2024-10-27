const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");

const studentCornerApp = express.Router();
studentCornerApp.use(express.json()); // Ensure the request body can be parsed

// POST: Create a new post
studentCornerApp.post("/post", expressAsyncHandler(async (req, res) => {
    const studentCornerCollection = req.app.get("postsCollection");
    const { content, type, username } = req.body;

    // Validate input
    if (!content || !type || !username) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const newPost = {
        content,
        type,
        username,
        createdAt: new Date(),
        replies: [] // Initialize replies as an empty array
    };

    // Insert post into the database
    const result = await studentCornerCollection.insertOne(newPost);
    console.log("Inserted Post ID:", result.insertedId); // Log the inserted post ID

    // Add the generated ID to the newPost object
    newPost._id = result.insertedId; 

    res.status(201).json({ message: "Post created successfully", post: newPost });
}));




    

    

// POST: Add a reply to a specific post
studentCornerApp.post("/post/:postId/reply", expressAsyncHandler(async (req, res) => {
    console.log("Incoming reply request:", req.params, req.body);
    const studentCornerCollection = req.app.get("postsCollection");
    const { postId } = req.params;
    const { replyContent, username } = req.body;

    // Validate ObjectId format
    if (!ObjectId.isValid(postId)) {
        console.log("Invalid ObjectId format:", postId);
        return res.status(400).json({ message: "Invalid post ID format." });
    }

    // Validate input
    if (!replyContent || !username) {
        return res.status(400).json({ message: "Reply content and username are required." });
    }

    const newReply = {
        replyContent,
        username,
        repliedAt: new Date()
    };

    // Find and update the post by ID
    const updatedPost = await studentCornerCollection.findOneAndUpdate(
        { _id: new ObjectId(postId) },
        { $push: { replies: newReply } },
        { returnDocument: 'after' }
    );

    if (!updatedPost.value) {
        console.log("Post not found with ID:", postId);
        return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json({ message: "Reply added successfully", post: updatedPost.value });
}));

// GET: Retrieve all posts
studentCornerApp.get("/post", expressAsyncHandler(async (req, res) => {
    const studentCornerCollection = req.app.get("postsCollection");

    if (!studentCornerCollection) {
        return res.status(500).json({ message: "Collection not found" });
    }

    const posts = await studentCornerCollection.find().toArray();
    res.status(200).json(posts);
}));

module.exports = studentCornerApp;
