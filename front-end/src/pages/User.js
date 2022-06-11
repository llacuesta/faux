import React, { Component } from 'react';
import queryString from 'query-string';
import Header from './components/Header';
import { Redirect } from 'react-router-dom';
import pfp from "./components/assets/default-pfp.png"

class User extends Component {

    constructor(props) {
        super(props)

        this.state = {
            query: queryString.parse(props.location.search).id,
            checkedIfLoggedIn: false,
            isLoggedIn: null,
            user: {
                fname: "",
                lname: "",
                email: ""
            }
        }
    }

    componentDidMount() {
        Promise.all([
            fetch("http://localhost:3001/check-if-logged-in", {
                method: "POST",
                credentials: "include"
            }),
            fetch('http://localhost:3001/get-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: this.state.query })
            })
        ])
        .then(([res1, res2]) => {
            return Promise.all([res1.json(), res2.json()])
        })
        .then(([body1, body2]) => {
            if (body1.isLoggedIn) {
                this.setState({ 
                    checkedIfLoggedIn: true,
                    isLoggedIn: true,
                 });
            } else {
                this.setState({
                    checkedIfLoggedIn: true,
                    isLoggedIn: false
                });
            }

            if (!body2.success) {
                alert("Something went wrong!")
            } else {
                this.setState({
                    user: body2.user
                })
                console.log(this.state)
            }
        })
    }
        
    render() {
        if (!this.state.checkedIfLoggedIn) {
            return (
                <div></div>
            )
        } else {
            if (this.state.isLoggedIn) {
                return (
                    <div>
                        <Header />
                        <div className="main">
                            <div className="profile">
                                <img src={pfp} alt="profile-pic"></img>
                                <h1>{this.state.user.fname} {this.state.user.lname}</h1>
                                <h2>{this.state.user.email}</h2>
                            </div>
                        </div>
                    </div>
                )
            } else {
                return <Redirect to="/log-in" />
            }
        }
    }
}

export default User;