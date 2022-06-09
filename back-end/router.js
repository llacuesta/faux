// Imports
import { signUp, login, checkIfLoggedIn } from "./controller.js";

const router = (app) => {
    app.post("/sign-up", signUp);
    app.post("/log-in", login);
    app.post("/check-if-logged-in", checkIfLoggedIn);
    
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
}

export default router;