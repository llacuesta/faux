import React, { Component } from 'react';
import pfp from "./assets/default-pfp.png";

class User extends Component {
    render() {
        return (
            <div className="info">
                <img src={pfp} alt="profile-pic"></img>
                <a href={"/user?id=" + this.props.id}><p>{this.props.fname} {this.props.lname}</p></a>
            </div>
        );
    }
}

export default User;