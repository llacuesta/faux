import React from "react";
import Cookies from "universal-cookie";
import Welcome from "./components/Welcome";

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
                localStorage.setItem("fname", body.fname);
                localStorage.setItem("lname", body.lname);
                localStorage.setItem("id", body.id);
                this.props.history.push("/feed");
            }
        })
    }

    render() {
        return (
            <div className="banner">
                <Welcome />
                <div className="form">
                    <h1>Log In</h1>
                    <form>
                        <div className="input">
                            <label htmlFor="l-email">Email</label>
                            <input id="l-email" type="email" />
                        </div>
                        <div className="input">
                            <label htmlFor="l-pword">Password</label>
                            <input id="l-pword" type="password" />
                        </div>
                        <button onClick={this.login}>Log In</button>
                    </form>

                    <p>
                        <a href="/sign-up">Sign Up</a> for an account
                    </p>
                </div>
            </div>
        )
    }
}

export default Login