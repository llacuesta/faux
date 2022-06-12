// Import
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const FriendRequest = mongoose.model("FriendRequest");

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

    newPost.save((err, post) => {
        if (err) {
            return res.send({ success: false });
        } else {
            User.findByIdAndUpdate(newPost.author, { $push: { posts: post._id } }, (err) => {
                if (err) {
                    return res.send({ success: false });
                } else {
                    return res.send({ success: true });
                }
            })
        }
    })
}

const getFeedPosts = (req, res) => {
    User.findById(req.body.id, (err, user) => {
        if (err || !user) {
            return res.send({ success: false });
        } else {
            let ids = [mongoose.Types.ObjectId(req.body.id)];
            user.friends.forEach(friend => {
                ids.push(friend)
            })
            let query = {
                $or: []
            }
            for (let id of ids) {
                let auth = {
                    author: id
                }
                query.$or.push(auth)
            }
            Post.aggregate([
                { $match: query }, 
                { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "author_info" } }
            ]).sort({ date: -1 }).exec((err, posts) => {
                if (err) {
                    console.log(err)
                    return res.send({ success: false });
                } else {
                    let allPosts = []
                    posts.forEach(post => {
                        let postCopy = {
                            postid: post._id,
                            authorid: post.author.toString(),
                            author: post.author_info[0].fname + " " +  post.author_info[0].lname,
                            date: post.date.toDateString().substr(4, 6),
                            caption: post.caption,
                            is_edited: post.is_edited
                        }
                        allPosts.push(postCopy);
                    })
                    return res.send({ success: true, posts: allPosts });
                }
            })
        }
    })
}

const getAllPostsByUser = (req, res) => {
    User.findById(req.body.id, (err, user) => {
        if (err || !user) {
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
            User.findByIdAndUpdate(req.body.author, { $pull: { posts: req.body.id } }, (err) => {
                if (err) {
                    return res.send({ success: false })
                } else {
                    return res.send({ success: true, deleted: post })
                }
            })
        }
    })
}

const isRequestSent = (req, res) => {
    FriendRequest.findOne({ $or: [
        { requester: req.body.requester, recipient: req.body.recipient },
        { requester: req.body.recipient, recipient: req.body.requester }
    ] }, (err, request) => {
        if (err) {
            return res.send({ success: false });
        } else if (!request) {
            return res.send({ success: true, requested: false, status: null });
        } else {
            return res.send({ success: true, requested: true, status: request.status });
        }
    })
}

const sendRequest = (req, res) => {
    const newRequest = new FriendRequest({
        requester: req.body.requester,
        recipient: req.body.recipient
    });

    newRequest.save((err) => {
        if (err) {
            return res.send({ success: false });
        } else {
            return res.send({ success: true, status: 1 });
        }
    })
}

const getRequests = (req, res) => {
    const searchID = mongoose.Types.ObjectId(req.body.id)
    FriendRequest.aggregate([{ $match: { recipient: searchID, status: 1 } }, { $lookup: { from: "users", localField: "requester", foreignField: "_id", as: "requester_info" } }] ,(err, requests) => {
        if (err) {
            return res.send({ success: false });
        } else {
            let users = []
            requests.forEach(request => {
                let user = {
                    id: request.requester_info[0]._id,
                    fname: request.requester_info[0].fname,
                    lname: request.requester_info[0].lname,
                }
                users.push(user)
            })
            return res.send({ success: true, requests: users });
        }
    })
}

const acceptRequest = (req, res) => {
    FriendRequest.findOneAndUpdate({ requester: mongoose.Types.ObjectId(req.body.requester), recipient: mongoose.Types.ObjectId(req.body.recipient) }, { status: 2 }, (err, request) => {
        if (err || !request) {
            return res.send({ success: false });
        } else {
            User.findByIdAndUpdate(req.body.recipient, { $push: { friends: mongoose.Types.ObjectId(req.body.requester) } }, (err) => {
                if (err) { return res.send({ success: false }); }
            })
            User.findByIdAndUpdate(req.body.requester, { $push: { friends: mongoose.Types.ObjectId(req.body.recipient) } }, (err) => {
                if (err) { return res.send({ success: false }); }
            })
            return res.send({ success: true });
        }
    })
}

const rejectRequest = (req, res) => {
    FriendRequest.findOneAndDelete({ requester: mongoose.Types.ObjectId(req.body.requester), recipient: mongoose.Types.ObjectId(req.body.recipient) }, (err, request) => {
        if (err || !request) {
            return res.send({ success: false });
        } else {
            return res.send({ success: true });
        }
    })
}

const getFriends = (req, res) => {
    User.aggregate([{ $match : { _id: mongoose.Types.ObjectId(req.body.id) } }, { $lookup: { from: "users", localField: "friends", foreignField: "_id", as: "friends_info" } }], (err, user) => {
        if (err || !user) {
            return res.send({ success: false });
        } else {
            let result = []
            user[0].friends_info.forEach(friend => {
                let friendCopy = {
                    id: friend._id,
                    fname: friend.fname,
                    lname: friend.lname
                }
                result.push(friendCopy)
            })
            console.log(result)
            return res.send({ success: true, friends: result });
        }
    })
}

export { signUp, login, checkIfLoggedIn, createPost, getFeedPosts, getAllPostsByUser, searchUsers, getUserInfo, editPost, deletePost, isRequestSent, sendRequest, getRequests, acceptRequest, rejectRequest, getFriends }