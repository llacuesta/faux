import React from "react";
import Welcome from "./components/Welcome";

const validate = (states) => {
    const errors = {}

    if (!states.fname) {
        errors.fname = "First name cannot be empty!"
    }
    if (!states.lname) {
        errors.lname = "Last name cannot be empty!"
    }
    if (!states.email) {
        errors.email = "Email cannot be empty!"
    } else if (!/^\S+@\S+\.\S+$/.test(states.email)) {
        errors.email = "Email is not valid!"
    }
    if (!states.pword) {
        errors.pword = "Password cannot be empty!"
    } else if (validatePassword(states.pword)) {
        errors.pword = validatePassword(states.pword)
    }
    if (!states.rpword) {
        errors.rpword = "Please repeat the password!"
    } else if (states.pword !== states.rpword) {
        errors.rpword = "Passwords do not match!"
    }

    return errors
}
const validatePassword = (password) => {
    let error = "";
    if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
        error = "Password is not valid!"
    }

    return error
}
const validateRPassword = (password, rpassword) => {
    let error = "";
    if (password !== rpassword) {
        error = "Passwords do not match!"
    }

    return error
}

class Signup extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            fname: "",
            lname: "",
            email: "",
            pword: "",
            rpword: "",
            errors: {
                fname: "",
                lname: "",
                email: "",
                pword: "",
                rpword: "",
            }
        }

        this.changeFnameHandler = this.changeFnameHandler.bind(this)
        this.changeLnameHandler = this.changeLnameHandler.bind(this)
        this.changeEmailHandler = this.changeEmailHandler.bind(this)
        this.changePwordHandler = this.changePwordHandler.bind(this)
        this.changeRPwordHandler = this.changeRPwordHandler.bind(this)
        this.signup = this.signup.bind(this);
    }

    changeFnameHandler(e) {
        this.setState({ fname: e.target.value })
    }
    changeLnameHandler(e) {
        this.setState({ lname: e.target.value })
    }
    changeEmailHandler(e) {
        this.setState({ email: e.target.value })
    }
    changePwordHandler(e) {
        let newState = {...this.state}
        newState.errors.pword = validatePassword(e.target.value)
        newState.errors.rpword = validateRPassword(e.target.value, this.state.rpword)
        this.setState({ newState, pword: e.target.value })
    }
    changeRPwordHandler(e) {
        let newState = {...this.state}
        newState.errors.rpword = validateRPassword(this.state.pword, e.target.value)
        this.setState({ newState, rpword: e.target.value })
    }
    signup(e) {
        e.preventDefault();
    
        const user = {
            fname: this.state.fname,
            lname: this.state.lname,
            email: this.state.email,
            password: this.state.pword
        }
        const errors = validate(this.state)
        if (errors.fname || errors.lname || errors.email || errors.pword || errors.rpword) {
            this.setState({ ...this.state, errors })
        } else {
            fetch (
                "http://localhost:3001/sign-up",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user)
                }
            )
            .then(response => response.json())
            .then(body => {
                if (body.success) { alert("Successfully saved user"); }
                else { alert("Failed to save user"); }
            });   
        }
    }

    render() {
        return (
            <div className="banner">
                <Welcome />
                <div className="form">
                    <h1>Sign Up</h1>
                    <form>
                        <div className="input">
                            <label htmlFor="fname">First Name</label>
                            <input 
                                id="fname"
                                type="text"
                                value={this.state.fname}
                                onChange={this.changeFnameHandler}
                            />
                        </div>
                        <div className="error">
                            {this.state.errors.fname && (<p>{this.state.errors.fname}</p>)}
                        </div>
                        <div className="input">
                            <label htmlFor="lname">Last Name</label>
                            <input 
                                id="lname"
                                type="text"
                                value={this.state.lname}
                                onChange={this.changeLnameHandler}
                            />
                        </div>
                        <div className="error">
                            {this.state.errors.lname && (<p>{this.state.errors.lname}</p>)}
                        </div>
                        <div className="input">
                            <label htmlFor="email">Email</label>
                            <input 
                                id="email"
                                type="email"
                                value={this.state.email}
                                onChange={this.changeEmailHandler}
                            />
                        </div>
                        <div className="error">
                            {this.state.errors.email && (<p>{this.state.errors.email}</p>)}
                        </div>
                        <div className="input">
                            <label htmlFor="pword">Password</label>
                            <input 
                                id="pword"
                                type="password"
                                value={this.state.pword}
                                onChange={this.changePwordHandler}
                            />
                        </div>
                        <div className="error">
                            {this.state.errors.pword && (<p>{this.state.errors.pword}</p>)}
                        </div>
                        <div className="input">
                            <label htmlFor="rpword">Confirm Password</label>
                            <input 
                                id="rpword"
                                type="password"
                                value={this.state.rpword}
                                onChange={this.changeRPwordHandler}
                                disabled={!this.state.pword}
                            />
                        </div>
                        <div className="error">
                            {this.state.errors.rpword && (<p>{this.state.errors.rpword}</p>)}
                        </div>
                        <button onClick={this.signup}>Sign Up</button>
                    </form>

                    <p>
                        Have an account? <a href="/log-in">Log In</a> instead.
                    </p>
                </div>
            </div>
        )
    }
}

export default Signup