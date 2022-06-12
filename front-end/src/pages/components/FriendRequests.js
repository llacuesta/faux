import React, { Component } from 'react';
import FriendRequest from './FriendRequest';

class FriendRequests extends Component {

    constructor (props) {
        super (props);

        this.state = {
            requests: []
        }
    }

    componentDidMount() {
        fetch(
            "http://localhost:3001/get-requests", 
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
                alert("Failed to retrieve friend requests")
            } else {
                this.setState({
                    requests: body.requests
                })
            }
        })
    }

    render() {
        if (this.state.requests.length === 0) {
            return (<div></div>);
        } else {
            return (
                <div className="friend-requests">
                    <p>Friend Requests</p>
                    {
                        this.state.requests.map((request, index) => {
                            return (
                                <FriendRequest key={index} user={this.props.user} request={request}/>
                            )
                        })
                    }
                </div>
            );    
        }
    }
}

export default FriendRequests;