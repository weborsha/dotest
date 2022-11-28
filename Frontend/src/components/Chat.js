import React, {Component} from "react";
import MessagePanel from './MessagePanel';
import User from './User';
import socket from "../reactsocket";

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUser: null,
            users: [],
        };
    }

    static propTypes = {};
    static defaultProps = {};

    UNSAFE_componentWillMount() {
        socket.on("connect", () => {
            this.state.users.forEach(user => {
                //console.log(user);
                if (user.self) {
                    user.connected = true;
                }
            });
        });
        socket.on("disconnect", () => {
            this.state.users.forEach(user => {
                if (user.self) {
                    user.connected = false;
                }
            });
        });
        const initReactiveProperties = user => {
            user.hasNewMessages = false;
        };
        socket.on("users", async users => {
            this.setState({users: users})

            users.forEach((user) => {
                user.messages.forEach((message) => {
                    message.fromSelf = message.from === socket.userID;
                });
                for (let i = 0; i < this.state.users.length; i++) {
                    const existingUser = this.state.users[i];
                    if (existingUser.userID === user.userID) {
                        existingUser.connected = user.connected;
                        existingUser.messages = user.messages;
                        return;
                    }
                }
                user.self = user.userID === socket.userID;
                initReactiveProperties(user);
                this.state.users.push(user);
            });
            // put the current user first, and sort by username
            this.state.users.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
        });
        socket.on("user connected", user => {
            for (let i = 0; i < this.state.users.length; i++) {
                const existingUser = this.state.users[i];
                if (existingUser.userID === user.userID) {
                    existingUser.connected = true;
                    return;
                }
            }
            initReactiveProperties(user);
            this.state.users.push(user);
        });
        socket.on("user disconnected", id => {
            for (let i = 0; i < this.state.users.length; i++) {
                const user = this.state.users[i];
                if (user.userID === id) {
                    user.connected = false;
                    break;
                }
            }
        });
        socket.on("private message", ({content, from, to}) => {
            for (let i = 0; i < this.state.users.length; i++) {
                const user = this.state.users[i];
                const fromSelf = socket.userID === from;
                if (user.userID === (fromSelf ? to : from)) {
                    user.messages.push({
                        content,
                        fromSelf
                    });
                    if (user !== this.state.selectedUser) {
                        user.hasNewMessages = true;
                    }
                    break;
                }
            }
        });
    }

    firstMessage() {
        if (this.username === "cat") {
            let cat = {
                userID: "0:10d05a3a0af3e0396fba327128ec008cde6152f92d4298becc432aa818faea3d",
                username: "three",
                connected: true,
                messages: []
            };
            //this.state.users.push(cat);
            this.setState({
                selectedUser: cat
            });
            cat.hasNewMessages = false;
        }
    }

    selectUser = (user) => {
        this.setState({selectedUser: user});
        user.hasNewMessages = false;

    }

    onMessage = (content) => {
        if (this.state.selectedUser) {
            socket.emit("private message", {
                content,
                to: this.state.selectedUser.userID
            });
            this.state.selectedUser.messages.push({
                content,
                fromSelf: true
            });
        }
    }

    render() {
        const renderMessagePanel = () => {
            if (this.state.selectedUser) {
                return <MessagePanel
                    user={this.state.selectedUser}
                    onMessage={(content) => this.onMessage(content)}
                />
            }
        }
        return (
            <div>
                <div className="left-panel">
                    {this.state.users.map((user) =>
                        <User
                            key={user.userID}
                            user={user}
                            selected={this.state.selectedUser === user}
                            selectUser={() => this.selectUser(user)}
                        />
                    )}
                    <button onClick={this.firstMessage}>Test message</button>
                </div>
                {renderMessagePanel()}
            </div>
        );
    }
}
