import React, { Component } from 'react';
import pfp from "./assets/default-pfp.png";

class Post extends Component {
    
    render() {
        const posts = this.props.data
        if (posts == null) {
            return (<div></div>);
        } else {
            return (
                <div className="posts">
                    {
                        posts.map((post, index) => {
                            return (
                                <div key={index} className="post">
                                    <div className="head">
                                        <img src={pfp} alt="profile-pic"></img>
                                        <div className="title">
                                            <a href={"/user?id=" + post.authorid}>{ post.author }</a> <br />
                                            <p>{ post.date }</p>
                                        </div>
                                    </div>
                                    <div className="content">
                                        { post.caption }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            );
        }
    }
}

export default Post;