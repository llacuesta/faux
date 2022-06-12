import React, { Component } from 'react';
import UserInfo from './UserInfo';

class Friends extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            friends: []
        }
    }
    
    componentDidMount() {
        fetch(
            "http://localhost:3001/get-friends",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: this.props.user })
            }
        )
        .then(response => response.json())
        .then(body => {
            if (!body.success) {
                alert("Failed to retrieve friends list")
            } else {
                this.setState({
                    friends: body.friends
                })
            }
        })
    }
    
    render() {
        if (this.state.friends.length === 0) {
            return (<div></div>)
        } else {
            return (
                <div className="friends-list">
                    <p>Friends</p>
                    {
                        this.state.friends.map((friend, index) => {
                            return (
                                <UserInfo key={index} id={friend.id} fname={friend.fname} lname={friend.lname}/>
                            )
                        })
                    }
                </div>
            );
        }
    }
}

export default Friends;