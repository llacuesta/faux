import React, { Component } from 'react';
import queryString from 'query-string';
import Header from './components/Header';
import Posts from './components/Posts';
import { Redirect } from 'react-router-dom';
import pfp from "./components/assets/default-pfp.png"

class User extends Component {

    constructor(props) {
        super(props)

        this.state = {
            query: queryString.parse(props.location.search).id,
            checkedIfLoggedIn: false,
            isLoggedIn: null,
            currentID: localStorage.getItem("id"),
            user: {
                fname: "",
                lname: "",
                email: ""
            },
            friendRequest: {
                requested: false,
                status: null
            },
            posts: []
        }

        this.addFriend = this.addFriend.bind(this);
    }

    addFriend(e) {
        e.preventDefault()

        fetch(
            "http://localhost:3001/add-friend",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requester: this.state.currentID, recipient: this.state.query })
            }
        )
        .then(response => response.json())
        .then(body => {
            if (!body.success) {
                alert("Failed to send request")
            } else {
                this.setState({
                    friendRequest: {
                        requested: true,
                        status: body.status
                    }
                })
            }
        })
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
            }),
            fetch("http://localhost:3001/get-request", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requester: this.state.currentID, recipient: this.state.query })
            }),
            fetch("http://localhost:3001/get-all-user-posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: this.state.query })
            })
        ])
        .then(([a, b, c, d]) => {
            return Promise.all([a.json(), b.json(), c.json(), d.json()])
        })
        .then(([a, b, c, d]) => {
            if (a.isLoggedIn) {
                this.setState({ 
                    checkedIfLoggedIn: true,
                    isLoggedIn: true,
                    currentID: localStorage.getItem("id")
                 });
            } else {
                this.setState({
                    checkedIfLoggedIn: true,
                    isLoggedIn: false
                });
            }

            if (!b.success) {
                alert("Something went wrong!")
            } else {
                this.setState({
                    user: b.user
                })
            }

            if (!c.success) {
                alert("Friend information cannot be retrieved")
            } else {
                this.setState({
                    friendRequest: {
                        requested: c.requested,
                        status: c.status
                    }
                })
            }

            if (!d.success) {
                alert("User posts cannot be retrieved")
            } else {
                this.setState({
                    posts: d.posts
                })
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
                if (this.state.currentID === this.state.query) {
                    return (
                        <div>
                            <Header />
                            <div className="main">
                                <div className="profile">
                                    <img src={pfp} alt="profile-pic"></img>
                                    <h1>{this.state.user.fname} {this.state.user.lname}</h1>
                                    <h2>{this.state.user.email}</h2>
                                </div>
                                <div className="feed">
                                    <h1>Your Posts</h1>
                                    <Posts user={this.state.query} data={this.state.posts}/>
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <Header />
                            <div className="main">
                                <div className="profile">
                                    <img src={pfp} alt="profile-pic"></img>
                                    <h1>{this.state.user.fname} {this.state.user.lname}</h1>
                                    <h2>{this.state.user.email}</h2>
                                </div>
                                <div className="feed">
                                    <h1>User Posts</h1>
                                    <Posts user={this.state.query} data={this.state.posts}/>
                                </div>
                                <div className="add-friend">
                                    {!this.state.friendRequest.requested ? <button onClick={this.addFriend}>Add Friend</button> : (this.state.friendRequest.status === 1 ? <button disabled={true}>Request Sent</button> : <button disabled={true}>Already Friends</button>)}
                                </div>
                            </div>
                        </div>
                    )
                }
            } else {
                return <Redirect to="/log-in" />
            }
        }
    }
}

export default User;