import React, { Component } from 'react';

class User extends Component {
    render() {
        return (
            <div>
                <p>{this.props.fname} {this.props.lname}</p>
                <a href="/create-post"><div className="create-link">Create Post</div></a>
            </div>
        );
    }
}

export default User;