// Imports
import { signUp, login, checkIfLoggedIn, createPost, getAllPostsByUser, searchUsers, getUserInfo, deletePost, editPost, isRequestSent, sendRequest, getRequests, acceptRequest, rejectRequest, getFeedPosts, getFriends } from "./controller.js";

const router = (app) => {
    app.post("/sign-up", signUp);
    app.post("/log-in", login);
    app.post("/check-if-logged-in", checkIfLoggedIn);
    app.post("/create-post", createPost);
    app.post("/get-feed", getFeedPosts);
    app.post("/get-all-user-posts", getAllPostsByUser);
    app.post("/search-users", searchUsers);
    app.post("/get-user", getUserInfo);
    app.post("/edit-post", editPost)
    app.post("/delete-post", deletePost);
    app.post("/get-request", isRequestSent);
    app.post("/add-friend", sendRequest);
    app.post("/get-requests", getRequests);
    app.post("/accept-request", acceptRequest);
    app.post("/reject-request", rejectRequest);
    app.post("/get-friends", getFriends);
}

export default router;