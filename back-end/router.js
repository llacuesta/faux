// Imports
import { signUp, login, checkIfLoggedIn, createPost, getAllPostsByUser, searchUsers, getUserInfo, deletePost, editPost } from "./controller.js";

const router = (app) => {
    app.post("/sign-up", signUp);
    app.post("/log-in", login);
    app.post("/check-if-logged-in", checkIfLoggedIn);
    
    /*
        TODO: add routers for
            - editing post
    */
   /*
    *   TODO: routers
            - adding friends (edit user to include friends)
            - confirm friends 
    */

    app.post("/create-post", createPost);
    app.post("/get-all-user-posts", getAllPostsByUser);
    app.post("/search-users", searchUsers);
    app.post("/get-user", getUserInfo);
    app.post("/edit-post", editPost)
    app.post("/delete-post", deletePost);
}

export default router;