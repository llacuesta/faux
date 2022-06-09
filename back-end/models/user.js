// Import
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Model
const UserSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]
});

UserSchema.pre("save", function(next) {
    const user = this;

    if (!user.isModified("password")) return next();

    return bcrypt.genSalt((saltError, salt) => {
        if (saltError) { return next(saltError); }

        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError) { return next(hashError); }

            user.password = hash;
            return next();
        });
    });
});

UserSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
}

// Export
mongoose.model("User", UserSchema);