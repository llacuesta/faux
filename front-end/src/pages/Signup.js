import React from "react";
import Input from "./components/Input.js";

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
            <div>
                <h1>User Sign Up</h1>
                <form>
                    <Input 
                        id="fname"
                        label="First Name"
                        type="text"
                        value={this.state.fname}
                        changeHandler={this.changeFnameHandler}
                        error={this.state.errors.fname}
                    />
                    <Input 
                        id="lname"
                        label="Last Name"
                        type="text"
                        value={this.state.lname}
                        changeHandler={this.changeLnameHandler}
                        error={this.state.errors.lname}
                    />
                    <Input 
                        id="email"
                        label="Email"
                        type="email"
                        value={this.state.email}
                        changeHandler={this.changeEmailHandler}
                        error={this.state.errors.email}
                    />
                    <Input 
                        id="pword"
                        label="Password"
                        type="password"
                        value={this.state.pword}
                        changeHandler={this.changePwordHandler}
                        error={this.state.errors.pword}
                    />
                    <Input 
                        id="rpword"
                        label="Repeat Password"
                        type="password"
                        value={this.state.rpword}
                        changeHandler={this.changeRPwordHandler}
                        error={this.state.errors.rpword}
                        disabled={!this.state.pword}
                    />
                    <button onClick={this.signup}>Sign Up</button>
                </form>

                <p>
                    Have an account? <a href="/log-in">Log In</a> instead.
                </p>
            </div>
        )
    }
}

export default Signup