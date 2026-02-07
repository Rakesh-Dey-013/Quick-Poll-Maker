import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,
        },
        voteCount: {
            type: Number,
            default: 0,
        },
    });

const pollSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Poll question is required"],
            trim: true,
            maxlength: [300, "Question cannot exceed 300 characters"],
        },

        options: {
            type: [optionSchema],
            validate: {
                validator: function (options) {
                    return options.length >= 2 && options.length <= 6;
                },
                message: "Poll must have between 2 and 6 options",
            },
        },

        correctOptionIndex: {
            type: Number,
            required: true,
            min: 0,
        },

        explanationNote: {
            type: String,
            trim: true,
            default: '',
            maxlength: [1000, "Explanation cannot exceed 1000 characters"],
        },

        tags: [
            {
                type: String,
                trim: true,
            },
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now
        },

        expiresAt: {
            type: Date,
            default: function () {
                return new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours from now
            }
        },
        shareId: {
            type: String,
            unique: true,
            default: function () {
                return Math.random().toString(36).substring(2, 10);
            }
        },
        isActive: {
            type: Boolean,
            default: true
        }
    });

// Index for faster queries
pollSchema.index({ expiresAt: 1 });
pollSchema.index({ shareId: 1 });
pollSchema.index({ tags: 1 });
pollSchema.index({ createdAt: -1 });

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;
