//delete tgis line 
const roleMiddleware = require("./middleware/roleMiddleware");


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const courseRoutes = require("./routes/courseRoutes");
app.use("/api/courses", courseRoutes);


// Public test route
app.get("/", (req, res) => {
    res.send("Education Learning Platform API is running!");
});

// Protected route: requires a valid JWT
app.get("/api/auth/me", authMiddleware, (req, res) => {
    res.json({
        message: "Authenticated successfully",
        user: req.user
    });
});

//delete
// Admin-only test route
app.get(
    "/api/admin/test",
    authMiddleware,
    roleMiddleware("admin"),
    (req, res) => {
        res.json({
            message: "Admin access granted"
        });
    }
);

// Start server only after MongoDB connects
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(
                `Server running at http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error("Startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
