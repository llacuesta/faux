import React, { Component } from 'react';

class SearchBar extends Component {

    constructor (props) {
        super (props);

        this.state = {
            search: ""
        }
        this.changeHandler = this.changeHandler.bind(this)
    }
    changeHandler(e) {
        this.setState({ search: e.target.value })
    }

    render() {
        return (
            <div className="search-bar">
                <input id="search" type="text" placeholder="Search users" onChange={this.changeHandler}/>
                <a className="button" href={ this.state.search ? "/search?search=" + document.getElementById("search").value : "#" }>&gt;</a>
            </div>
        );
    }
}

export default SearchBar;