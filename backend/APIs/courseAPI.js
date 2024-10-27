let exp = require("express");
let courseApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");

// Add a body parser middleware
courseApp.use(exp.json());

// GET: Retrieve all courses
courseApp.get("/courses", expressAsyncHandler(async (req, res) => {
    const coursesCollection = req.app.get("coursesCollection");

    try {
        const courses = await coursesCollection.find().toArray();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
}));

// GET: Retrieve a specific course by ID
courseApp.get("/courses/:courseId", expressAsyncHandler(async (req, res) => {
    const coursesCollection = req.app.get("coursesCollection");
    const { courseId } = req.params;

    try {
        const course = await coursesCollection.findOne({ courseId: courseId });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Error fetching course", error: error.message });
    }
}));

// POST: Add a new course
courseApp.post("/courses", expressAsyncHandler(async (req, res) => {
    const coursesCollection = req.app.get("coursesCollection");
    const newCourse = req.body;

    try {
        await coursesCollection.insertOne(newCourse);
        res.status(201).json({ message: "Course added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding course", error: error.message });
    }
}));

// PUT: Update an existing course
courseApp.put("/courses/:courseId", expressAsyncHandler(async (req, res) => {
    const coursesCollection = req.app.get("coursesCollection");
    const { courseId } = req.params;
    const updatedCourse = req.body;

    try {
        const result = await coursesCollection.updateOne(
            { courseId: courseId },
            { $set: updatedCourse }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating course", error: error.message });
    }
}));

// DELETE: Remove a course
courseApp.delete("/courses/:courseId", expressAsyncHandler(async (req, res) => {
    const coursesCollection = req.app.get("coursesCollection");
    const { courseId } = req.params;

    try {
        const result = await coursesCollection.deleteOne({ courseId: courseId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting course", error: error.message });
    }
}));

module.exports = courseApp;
