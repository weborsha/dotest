import React, {Component} from "react";
import PropTypes from "prop-types"
import StatusIcon from "./StatusIcon";

export default class User extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: Object,
            selected: false,
        };
    }

    static propTypes = {user: PropTypes.object, selected: PropTypes.bool}
    static defaultProps = {}

    render() {
        const status = this.props.user.connected ? "online" : "offline"
        return (
            <div className={this.props.selected ? 'user selected' : 'user'} onClick={this.props.selectUser}>
                <div className="description">
                    <div className="name">
                        {this.props.user.username} {this.props.user.self ? " (yourself)" : ""}
                    </div>
                    <div className="status">
                        <StatusIcon connected={this.props.user.connected}/>
                        {status}
                    </div>
                </div>
                {this.props.user.hasNewMessages ? (
                    <div className="new-messages">!</div>
                ) : null}
            </div>
        )
    }
}