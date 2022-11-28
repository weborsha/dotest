import {Component} from "react";
import PropTypes from "prop-types";

export default class StatusIcon extends Component {
    static propTypes = {
        connected: PropTypes.bool,
    };
    props: {
        connected: Boolean,
    }

    handleChange() {
        this.setState({connected: true});
    }

    render() {
        let className = this.props.connected ? 'icon connected' : 'icon';
        return (
            //Вот тут дописать
            <i className={className} onChange={this.handleChange}></i>
        );
    }
}