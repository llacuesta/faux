// Import
import mongoose from "mongoose";

// Model
const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caption: { type: String },
    date: { type: Date, default: Date.now },
    is_edited: { type: Boolean, default: false },
});

// Export
mongoose.model("Post", PostSchema)