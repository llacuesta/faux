import React from "react";
import { Redirect } from "react-router-dom";
import CreatePost from "./components/CreatePost";
// import Cookies from "universal-cookie";

class Feed extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            checkedIfLoggedIn: false,
            isLoggedIn: null,
            user: localStorage.getItem("username")
        }
    }

    componentDidMount() {
        fetch(
            "http://localhost:3001/check-if-logged-in",
            {
                method: "POST",
                credentials: "include"
            }
        )
        .then(response => response.json())
        .then(body => {
            if (body.isLoggedIn) {
                console.log(this.state)
                this.setState({ 
                    checkedIfLoggedIn: true,
                    isLoggedIn: true,
                    user: localStorage.getItem("username")
                 });
            } else {
                this.setState({
                    checkedIfLoggedIn: true,
                    isLoggedIn: false
                });
            }
        });
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
                        Welcome to Feed, {this.state.user}
                        <CreatePost />
                    </div>
                )
            } else {
                return <Redirect to="/log-in" />
            }
        }
    }
}

export default Feed