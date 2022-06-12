import React, { Component } from 'react';
import UserInfo from './UserInfo';

class FriendRequest extends Component {

    constructor(props) {
        super(props);
        
        this.accept = this.accept.bind(this);
        this.reject = this.reject.bind(this);
    }
    
    accept(e) {
        e.preventDefault();

        fetch(
            "http://localhost:3001/accept-request",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ requester: this.props.request.id, recipient: this.props.user })
            }
        )
        .then(response => response.json())
        .then(body => {
            if (!body.success) {
                alert("Failed to confirm request")
            } else {
                window.location.reload()
            }
        })
    }

    reject(e) {
        e.preventDefault();

        fetch(
            "http://localhost:3001/reject-request",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ requester: this.props.request.id, recipient: this.props.user })
            }
        )
        .then(response => response.json())
        .then(body => {
            if (!body.success) {
                alert("Failed to reject request")
            } else {
                window.location.reload()
            }
        })
    }

    render() {
        return (
            <div className="friend-request">
                <UserInfo id={this.props.request.id} fname={this.props.request.fname} lname={this.props.request.lname}/>
                <div className="options">
                    <button onClick={this.accept}>Accept</button>
                    <button onClick={this.reject}>Reject</button>
                </div>
            </div>
        );
    }
}

export default FriendRequest;