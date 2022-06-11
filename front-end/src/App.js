import { BrowserRouter, Route } from "react-router-dom"
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import Login from "./pages/Login";

function App() {
    return (
        <div className="App">
            <div className="wrapper">
                <BrowserRouter>
                    <Route exact={true} path="/sign-up" component={Signup} />
                    <Route exact={true} path="/log-in" component={Login} />
                    <Route exact={true} path="/feed" component={Feed} />
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
