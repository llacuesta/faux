import React, { Component } from 'react';

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
                                    <div className="title">
                                        <a href="#">{ post.author }</a> <br />
                                        <p>{ post.date }</p>
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