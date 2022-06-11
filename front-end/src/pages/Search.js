import React, { Component } from 'react';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import UserInfo from './components/UserInfo';

class Search extends Component {
    constructor(props) {
        super(props)

        this.state = {
            query: queryString.parse(props.location.search).search,
            checkedIfLoggedIn: false,
            isLoggedIn: null,
            users: [],
            user: {
                fname: localStorage.getItem("fname"),
                lname: localStorage.getItem("lname"),
            },
            id: localStorage.getItem("id")
        }
    }

    componentDidMount() {
        Promise.all([
            fetch("http://localhost:3001/check-if-logged-in", {
                method: "POST",
                credentials: "include"
            }),
            fetch('http://localhost:3001/search-users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ search: this.state.query })
            })
        ])
        .then(([res1, res2]) => {
            return Promise.all([res1.json(), res2.json()])
        })
        .then(([body1, body2]) => {
            if (body1.isLoggedIn) {
                this.setState({ 
                    checkedIfLoggedIn: true,
                    isLoggedIn: true,
                    user: {
                        fname: localStorage.getItem("fname"),
                        lname: localStorage.getItem("lname"),
                    },
                    id: localStorage.getItem("id")
                 });
            } else {
                this.setState({
                    checkedIfLoggedIn: true,
                    isLoggedIn: false
                });
            }

            if (!body2.success) {
                alert("Something went wrong!")
            } else {
                this.setState({
                    users: body2.users
                })
            }
        })
    }

    render() {
        if (!this.state.checkedIfLoggedIn) {
            return (
                <div></div>
            )
        } else {
            if (this.state.isLoggedIn) {
                return (
                    <div>
                        <Header />
                        <div className="main">
                            <div className="search-results">
                                <h1>Results for <i>{this.state.query}</i> : </h1>
                                {
                                    this.state.users.map((user, i) => {
                                        return <UserInfo key={i} id={user.id} fname={user.fname} lname={user.lname}/>
                                    })
                                }
                            </div>
                            <div className="user">
                                <SearchBar />
                                <UserInfo id={this.state.id} fname={this.state.user.fname} lname={this.state.user.lname} />
                            </div>
                        </div>
                    </div>
                )
            } else {
                return <Redirect to="/log-in" />
            }
        }
    }
}

export default Search;