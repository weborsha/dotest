import React, {Component} from "react";
import PropTypes from "prop-types";
import socket from "../reactsocket";
import StatusIcon from "./StatusIcon";

export default class MessagePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            input: "",
            is_blacklist: props.user.in_blacklist
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.messageChange = this.messageChange.bind(this);
        this.blackList = this.blackList.bind(this);
    }

    static propTypes = {
        user: PropTypes.object
    };
    static defaultProps = {};

    messageChange(event) {
        this.setState({input: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();
        if (this.state.input.length > 0) {
            this.props.onMessage(this.state.input);
        }
        this.setState({input: ''});
    }


    displaySender(message: any, index: number) {
        return (
            index === 0 ||
            this.props.user.messages[index - 1].fromSelf !==
            this.props.user.messages[index].fromSelf
        );
    }

    blackList() {
        if (this.props.user) {
            if (!this.props.user.in_blacklist) {
                socket.emit("add to blacklist", this.props.user.userID);
                this.props.user.in_blacklist = true;
                this.setState({is_blacklist: true});
            } else {
                socket.emit("remove from blacklist", this.props.user.userID);
                this.props.user.in_blacklist = false;
                this.setState({is_blacklist: false});
                this.props.user.messages.push({
                    content: "You have removed this user from blacklist",
                    fromSelf: true
                });
            }
        }
    }

    render() {
        return (
            <div className="right-panel">
                <div className="header">
                    <StatusIcon connected={this.props.user.connected}/>
                    {this.props.user.username}
                </div>
                <ul className="messages">
                    {this.props.user.messages.map((message, index) => (
                        <li className="message" key={index}>
                            {this.displaySender(message, index) && (
                                <div className="sender">
                                    {message.fromSelf ? "(yourself)" : this.props.user.username}
                                </div>
                            )}
                            {message.content}
                        </li>
                    ))}
                </ul>
                <form className="form" onSubmit={this.onSubmit}>
                    <textarea value={this.state.input} onChange={this.messageChange} placeholder="Your message..."
                              className="input"></textarea>
                    <button className="send-button">Send</button>
                </form>
                <button
                    onClick={this.blackList}>{!this.state.is_blacklist ? 'Add to Blacklist' : 'Remove from Blacklist'}</button>
            </div>
        );
    }
}

