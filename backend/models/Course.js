
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Course title is required"],
            trim: true,
            maxlength: 150
        },

        description: {
            type: String,
            required: [true, "Course description is required"],
            trim: true
        },

        educator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: String,
            required: [true, "Course category is required"],
            trim: true
        },

        price: {
            type: Number,
            default: 0,
            min: 0
        },

        isPublished: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Course", courseSchema);
