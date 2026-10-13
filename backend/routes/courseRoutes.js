
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createCourse,
    getCourses,
    getMyCourses,
    publishCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

// Public: View all published courses
router.get("/", getCourses);

// Protected: Educators can view their own courses, including drafts
router.get(
    "/mine",
    authMiddleware,
    roleMiddleware("educator"),
    getMyCourses
);

// Protected: Educators can create courses
router.post(
    "/",
    authMiddleware,
    roleMiddleware("educator"),
    createCourse
);

// Protected: Educators can publish their own courses
router.patch(
    "/:id/publish",
    authMiddleware,
    roleMiddleware("educator"),
    publishCourse
);

// Protected: Educators can update their own courses
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("educator"),
    updateCourse
);

// Protected: Educators can delete their own courses
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("educator"),
    deleteCourse
);

module.exports = router;
