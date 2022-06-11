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
            console.log(user)
            return res.send({
                success: true,
                token,
                fname: user.fname,
                lname: user.lname,
                id: user._id
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

const createPost = (req, res) => {
    const newPost = new Post({
        author: req.body.author,
        caption: req.body.caption
    });

    newPost.save((err) => {
        if (err) {
            return res.send({ success: false });
        } else {
            return res.send({ success: true });
        }
    })
}

const getAllPostsByUser = (req, res) => {
    User.findById(req.body.id, (err, user) => {
        if (err) {
            return res.send({ success: false });
        } else {
            Post.find({ author: req.body.id }, (err, posts) => {
                if (err) {
                    return res.send({ success: false });
                } else {
                    let allPosts = []
                    posts.forEach(post => {
                        let postCopy = {
                            postid: post._id,
                            authorid: user._id,
                            author: user.fname + " " + user.lname,
                            date: post.date.toDateString().substr(4, 6),
                            caption: post.caption,
                            is_edited: post.is_edited
                        }
                        allPosts.push(postCopy);
                    });
                    return res.send({ success: true, posts: allPosts});
                }
            })
        }
    })
}

const searchUsers = (req, res) => {    
    User.find({ "$or": [
        { "fname": { "$regex": new RegExp("^" + req.body.search.toLowerCase(), "i") } }, 
        { "lname": { "$regex": new RegExp("^" + req.body.search.toLowerCase(), "i") } }
    ] }, (err, users) => {
        if (err) {
            return res.send({ success: false });
        } else {
            let result = []
            users.forEach(user => {
                console.log(user)
                let userCopy = {
                    id: user._id,
                    fname: user.fname,
                    lname: user.lname
                }
                result.push(userCopy)
            })
            return res.send({ success: true, users: result });
        }
    })
}

const getUserInfo = (req, res) => {
    User.findById(req.body.id, (err, user) => {
        if (err) {
            return res.send({ success: false });
        } else {
            let userResult = {
                fname: user.fname,
                lname: user.lname,
                email: user.email
            }
            return res.send({ success: true, user: userResult })
        }
    })
}

const editPost = (req, res) => {
    console.log(req.body)
    Post.findByIdAndUpdate(req.body.id, { caption: req.body.newCaption, is_edited: true, date: Date.now() }, (err, post) => {
        if (err || !post) {
            return res.send({ success: false });
        } else {
            return res.send({ success: true, edited: post })
        }
    })
}

const deletePost = (req, res) => {
    Post.findByIdAndRemove(req.body.id, (err, post) => {
        if (err || !post) {
            return res.send({ success: false });
        } else {
            return res.send({ success: true, deleted: post })
        }
    })
}

export { signUp, login, checkIfLoggedIn, createPost, getAllPostsByUser, searchUsers, getUserInfo, editPost, deletePost }