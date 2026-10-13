
const Course = require("../models/Course");

// @desc    Create a course
// @route   POST /api/courses
// @access  Educators only
const createCourse = async (req, res) => {
    try {
        const { title, description, category, price } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                message: "Title, description and category are required"
            });
        }

        const course = await Course.create({
            title,
            description,
            category,
            price: price ?? 0,
            educator: req.user.userId
        });

        res.status(201).json({
            message: "Course created successfully",
            course
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create course",
            error: error.message
        });
    }
};

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .populate("educator", "name");

        res.status(200).json({
            count: courses.length,
            courses
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch courses",
            error: error.message
        });
    }
};

// @desc    Get courses created by the logged-in educator
// @route   GET /api/courses/mine
// @access  Educators only
const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({
            educator: req.user.userId
        });

        res.status(200).json({
            count: courses.length,
            courses
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch your courses"
        });
    }
};

// @desc    Publish a course
// @route   PATCH /api/courses/:id/publish
// @access  Course owner (educator)
const publishCourse = async (req, res) => {
    try {
        const course = await Course.findOne({
            _id: req.params.id,
            educator: req.user.userId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or you do not own it"
            });
        }

        course.isPublished = true;
        await course.save();

        res.status(200).json({
            message: "Course published successfully",
            course
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        res.status(500).json({
            message: "Failed to publish course"
        });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Course owner (educator)
const updateCourse = async (req, res) => {
    try {
        const { title, description, category, price } = req.body;

        const course = await Course.findOne({
            _id: req.params.id,
            educator: req.user.userId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or you do not own it"
            });
        }

        // Update only the fields supplied in the request
        if (title !== undefined) {
            if (typeof title !== "string" || !title.trim()) {
                return res.status(400).json({
                    message: "Title cannot be empty"
                });
            }
            course.title = title;
        }

        if (description !== undefined) {
            if (typeof description !== "string" || !description.trim()) {
                return res.status(400).json({
                    message: "Description cannot be empty"
                });
            }
            course.description = description;
        }

        if (category !== undefined) {
            if (typeof category !== "string" || !category.trim()) {
                return res.status(400).json({
                    message: "Category cannot be empty"
                });
            }
            course.category = category;
        }

        if (price !== undefined) {
            if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
                return res.status(400).json({
                    message: "Price must be a non-negative number"
                });
            }
            course.price = price;
        }

        await course.save();

        res.status(200).json({
            message: "Course updated successfully",
            course
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Failed to update course"
        });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Course owner (educator)
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndDelete({
            _id: req.params.id,
            educator: req.user.userId
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found or you do not own it"
            });
        }

        res.status(200).json({
            message: "Course deleted successfully",
            courseId: course._id
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        res.status(500).json({
            message: "Failed to delete course"
        });
    }
};

module.exports = {
    createCourse,
    getCourses,
    getMyCourses,
    publishCourse,
    updateCourse,
    deleteCourse
};
