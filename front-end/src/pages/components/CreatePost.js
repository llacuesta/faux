import mongoose from 'mongoose';
import React, { Component } from 'react';

class CreatePost extends Component {

    constructor(props) {
        super(props);

        this.createPost = this.createPost.bind(this);
    }

    createPost(e, authorID) {
        e.preventDefault();

        const post = {
            author: mongoose.Types.ObjectId(authorID),
            caption: document.getElementById("caption").value
        }
        fetch (
            "http://localhost:3001/create-post",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(post)
            }
        )
        .then(response => response.json())
        .then(body => {
            if (!body.success) { alert("Failed to create post"); }
            else { alert("Post created!"); }
        })
    }

    render() {
        return (
            <div className="new-post">
                <h1>Create Post</h1>
                <div className="fields">
                    <form>
                        <textarea id="caption" placeholder="Post something..."/>
                    </form>
                    <button onClick={(e) => this.createPost(e, this.props.author)}>&gt;</button>
                </div>
            </div>
        );
    }
}

export default CreatePost;