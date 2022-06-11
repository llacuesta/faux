import React from "react";
import { Redirect } from "react-router-dom";
// import CreatePost from "./components/CreatePost";
import Header from "./components/Header";
import Post from "./components/Post";
import User from "./components/User";
// import Cookies from "universal-cookie";

class Feed extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            checkedIfLoggedIn: false,
            isLoggedIn: null,
            user: {
                fname: localStorage.getItem("fname"),
                lname: localStorage.getItem("lname"),
            },
            id: localStorage.getItem("id")
        }
    }

    componentDidMount() {
        Promise.all([
            fetch("http://localhost:3001/check-if-logged-in", {
                method: "POST",
                credentials: "include"
            }), 
            fetch("http://localhost:3001/get-all-user-posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: this.state.id })
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
                    user: {
                        fname: localStorage.getItem("fname"),
                        lname: localStorage.getItem("lname"),
                    },
                    id: localStorage.getItem("id")
                 });
            } else {
                this.setState({
                    checkedIfLoggedIn: true,
                    isLoggedIn: false
                });
            }

            if (body2.success) {
                this.setState({
                    posts: body2.posts
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
                return (
                    <div>
                        <Header />
                        <div className="main">
                            <div className="feed">
                                {/* <CreatePost author={this.state.id}/> */}
                                <Post data={this.state.posts}/>
                            </div>
                            <div className="user">
                                
                                <User fname={this.state.user.fname} lname={this.state.user.lname} />
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

export default Feed