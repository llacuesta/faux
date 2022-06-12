// Import
import mongoose from "mongoose";

// Model
const FriendRequestSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: Number, required: true, default: 1 }
});

// Export
mongoose.model("FriendRequest", FriendRequestSchema)