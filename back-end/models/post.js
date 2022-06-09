// Import
import mongoose from "mongoose";

// Model
const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caption: { type: String },
    date: { type: Data, default: Date.now },
    is_edited: { type: Boolean, default: false },
    content: { data: Buffer, type: String, required: true }
});

// Export
mongoose.model("Post", PostSchema)