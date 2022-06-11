import React, { Component } from 'react';

class Welcome extends Component {
    render() {
        return (
            <div className="welcome">
                <h1>welcome to <p className="title">faux.</p></h1>
                <p className="subtitle">express your true self</p>
            </div>
        );
    }
}

export default Welcome;