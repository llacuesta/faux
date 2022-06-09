// Import
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const User = mongoose.model("User");
const Post = mongoose.model("Post");

// Endpoints
const signUp = (req, res) => {
    const newUser = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: req.body.password
    });

    console.log("New user: ");
    console.log(newUser);

    newUser.save((err) => {
        if (err) { return res.send({ success: false }); }
        else { return res.send({ success: true }); }
    });
}

const login = (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.pword;

    User.findOne({ email }, (err, user) => {
        // Checking if email exists in the db
        if (err || !user) {
            console.log("User not found!");
            return res.send({ success: false });
        }

        // Check if the password is correct
        user.comparePassword(password, (err, isMatch) => {
            if (err || !isMatch) {
                console.log("Wrong password!");
                return res.send({ success: false });
            }

            // Successful login
            console.log("Successfully logged in");
            const tokenPayload = {
                _id: user._id
            }
            const token = jwt.sign(tokenPayload, "CD718D6872E1A6D69F47578A41FCD");

            // Returning the token to the client
            return res.send({
                success: true,
                token,
                username: user.fname
            });
        })
    })
}

const checkIfLoggedIn = (req, res) => {
    
    // Checking if cookies/authToken cookie exists
    if (!req.cookies || !req.cookies.authToken) {
        return res.send({ isLoggedIn: false });
    }
    return jwt.verify(
        req.cookies.authToken,
        "CD718D6872E1A6D69F47578A41FCD",
        (err, tokenPayload) => {
            if (err) {
                return res.send({ isLoggedIn: false })
            }

            const userID = tokenPayload._id;
            return User.findById(userID, (userErr, user) => {
                // Check if user exists or if there is an error
                if (userErr || !user) {
                    return res.send({ isLoggedIn: false });
                }

                console.log("User is currently logged in");
                return res.send({ isLoggedIn: true })
            })
        }
    )
}

    /*
        TODO: add routers for
            - creating new post
            - editing post
            - deleting post
    */
   /*
    *   TODO: routers
            - searching for user
            - adding friends (edit user to include friends)
            - confirm friends 
    */

const createPost = (req, res) => {
    const newPost = new Post({
        author: res.body.author,
        caption: res.body.caption,
        content: res.body.content
    });

    newPost.save((err) => {
        if (err) {
            return res.send({ success: false });
        } else {
            return res.send({ success: true });
        }
    })
}

export { signUp, login, checkIfLoggedIn }