import React, { Component } from 'react';
import Post from './Post';


class Posts extends Component {

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
                                <Post key={index} user={this.props.user} post={post}/>
                            )
                        })
                    }
                </div>
            );
        }
    }
}

export default Posts;