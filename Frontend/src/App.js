import React, {Component} from "react";
import Chat from "./components/Chat";
import SelectUsername from "./components/SelectUsername";
import socket from "./reactsocket";
import {TestAuthorisation} from "./components/TestAuthorisation";

// import { ConnectWallet } from "./ConnectWallet";
// import { Loading } from "./Loading";
// import { Login } from "./Login";
// import { TestAuthorisation } from "./TestAuthorisation";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameAlreadySelected: false,
            nftAlreadySelected: false,
            username: '',
            authorisedData: ''
        };
    }

    static propTypes = {};
    static defaultProps = {};


    componentDidMount() {
        const sessionID = localStorage.getItem("sessionID");
        const token = localStorage.getItem("TOKEN");

        if (sessionID && token) {
            this.setState({usernameAlreadySelected: true});
            socket.auth = {sessionID, token};
            socket.connect();
        }

        socket.on("session", ({sessionID, userID}) => {
            socket.auth = {sessionID};
            localStorage.setItem("sessionID", sessionID);
            socket.userID = userID;
        });
        socket.on("connect_error", err => {
            if (err.message === "invalid username") {
                this.setState({usernameAlreadySelected: false});
            }
        });
    }


    updateData = (value) => {
        this.setState({usernameAlreadySelected: true})
        this.setState({username: value})
        socket.auth = value;
        //socket.pubkey = this.pub_key;
        socket.pubkey = 'c254a66450492fe630257fe62de3ad6ca37dec5795f70612feaa99d905f5c5d3';
        localStorage.setItem('sessionID', value);
        {
            this.componentDidMount()
        }
    }

    render() {
        return (
            <div id="app">
                {!this.state.usernameAlreadySelected ? (
                    <SelectUsername updateData={(username) => this.updateData(username)}/>
                ) : (
                    // this.state.authorisedData === '' ? (
                    //     <TestAuthorisation getAuthorisedData={() => this._getAuthorisedData()} />
                    // ) : (
                    //     <p>{this.state.authorisedData}</p>
                    // )
                    <Chat/>
                )
                }
            </div>
        );
    }

    async _getChat() {
        const API_URL = "http://localhost:8080"
        const res = await fetch(`${API_URL}/api/chat`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': window.localStorage.getItem("TOKEN")
            },
        });
        const content = await res.json();
        console.log(content.message)
        this.setState({
            loading: false,
            authorisedData: content.message
        });
    }
}