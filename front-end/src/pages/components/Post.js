import React, { Component } from 'react';
import pfp from "./assets/default-pfp.png";

class Post extends Component {

    constructor (props) {
        super (props);

        this.state = {
            editing: false
        }

        this.editPost = this.editPost.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    editPost(e, postID) {
        e.preventDefault();

        fetch (
            "http://localhost:3001/edit-post",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: postID, newCaption: document.getElementById("new-caption").value })
            }
        )
        .then(response => response.json())
        .then(body => {
            if (!body.success) {
                alert("Failed to edit post")
            } else {
                alert("Post edited!")
            }
        })

        this.setState({
            editing: false
        })
    }
    deletePost(e, postID) {
        e.preventDefault();

        fetch (
            "http://localhost:3001/delete-post",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: postID })
            }
        )
        .then(response => response.json())
        .then(body => {
            if (!body.success) {
                alert("Failed to delete post")
            } else {
                alert("Post deleted!")
            }
        })
    }

    render() {
        if (!this.state.editing) {
            return (
                <div className="post">
                    <div className="head">
                        <img src={pfp} alt="profile-pic"></img>
                        <div className="title">
                            <a href={"/user?id=" + this.props.post.authorid}>{ this.props.post.author }</a> <br />
                            <p>{ this.props.post.date }</p>
                        </div>
                        { this.props.user === this.props.post.authorid ? <div className="options"><button className="edit" onClick={() => { this.setState({ editing: true }) }}>e</button><button className="delete" onClick={(e) => this.deletePost(e, this.props.post.postid)}>d</button></div> : <div></div> }
                    </div>
                    <div className="content">
                        { this.props.post.caption }
                    </div>
                </div>
            );
        } else {
            return (
                <div className="post">
                    <div className="head">
                        <img src={pfp} alt="profile-pic"></img>
                        <div className="title">
                            <a href={"/user?id=" + this.props.post.authorid}>{ this.props.post.author }</a> <br />
                            <p>{ this.props.post.date }</p>
                        </div>
                    </div>
                    <div className="edit-input">
                        <input type="text" id="new-caption" defaultValue={this.props.post.caption}/>
                        <button onClick={(e) => this.editPost(e, this.props.post.postid)}>&#10003;</button>
                        <button onClick={() => { this.setState({ editing: false }) }}>&#10007;</button>
                    </div>
                </div>
            );
        }
    }
}

export default Post;