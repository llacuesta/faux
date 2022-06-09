import React from "react";
import Input from "./components/Input.js";
import Cookies from "universal-cookie";

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.login = this.login.bind(this);
    }

    login(e) {
        e.preventDefault();

        const credentials = {
            email: document.getElementById("l-email").value,
            pword: document.getElementById("l-pword").value
        }
        fetch (
            "http://localhost:3001/log-in",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            }
        )
        .then(response => response.json())
        .then(body => {
            if (!body.success) { alert("Failed to log in"); }
            else {
                // Storing the token as a cookie
                const cookies = new Cookies();
                cookies.set(
                    "authToken",
                    body.token,
                    {
                        path: "localhost:3001",
                        age: 60*60,
                        sameSite: "lax"
                    }
                );
                localStorage.setItem("username", body.username);
                this.props.history.push("/feed")
            }
        })
    }

    render() {
        return (
            <div>
                <h1>Log In</h1>
                <form>
                    <Input
                        id="l-email"
                        label="Email"
                        type="email"
                    />
                    <Input
                        id="l-pword"
                        label="Password"
                        type="password"
                    />
                    <button onClick={this.login}>Log In</button>
                </form>

                <p>
                    <a href="/sign-up">Sign Up</a> for an account
                </p>
            </div>
        )
    }
}

export default Login