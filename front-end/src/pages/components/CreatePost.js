import React, { Component } from 'react';

class CreatePost extends Component {
    render() {
        return (
            <div>
                <form>
                    <input 
                        type="file"
                    />
                    <input
                        type="text"
                    />
                </form>
                <button>Post</button>
                <button>Edit</button>
                <button>Delete</button>
            </div>
        );
    }
}

export default CreatePost;