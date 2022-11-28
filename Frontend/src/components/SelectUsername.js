import React, {Component} from "react";
import {ProviderRpcClient, TvmException} from "everscale-inpage-provider";

const API_URL = "http://localhost:8080"

export default class SelectUsername extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            pub_key: null,
        };
        this.onSigning = this.onSigning.bind(this);
    }

    static propTypes = {};
    static defaultProps = {};

    async onSigning(event) {
        event.preventDefault();

        const ever = new ProviderRpcClient();
        if (!(await ever.hasProvider())) {
            throw new Error('Extension is not installed');
        }
        const {accountInteraction} = await ever.requestPermissions({
            permissions: ['basic', 'accountInteraction'],
        });
        if (accountInteraction == null) {
            throw new Error('Insufficient permissions');
        }

        const public_key = accountInteraction.publicKey;
        const selectedAddress = accountInteraction.address;

        const authChallengeRes = await fetch(`${API_URL}/api/auth/authChallengeEver`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'address': selectedAddress})
        });
        const contentAuthChallenge = await authChallengeRes.json();
        const message = contentAuthChallenge.message;

        try {
            let encoded_message = window.btoa(message);

            const {accountInteraction} = await ever.requestPermissions({
                permissions: ['basic', 'accountInteraction'],
            });
            if (accountInteraction == null) {
                throw new Error('Insufficient permissions');
            }

            const sign = await ever.signData({
                publicKey: accountInteraction.publicKey,
                data: encoded_message
            });

            const authVerifyRes = await fetch(`${API_URL}/api/auth/auth_verifyEver`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'address': selectedAddress,
                    'signature': sign.signature,
                    'publicKey': accountInteraction.publicKey,
                    'dataHash': sign.dataHash
                })
            });

            const contentAuthVerify = await authVerifyRes.json();
            const token = contentAuthVerify.accessToken;
            window.localStorage.setItem("TOKEN", token);

            // this.setState({
            //     username: selectedAddress['_address'],
            //     pub_key: public_key
            // });
            this.state.username = selectedAddress['_address'];
            this.state.pub_key = public_key;
            this.props.updateData(this.state.username);
        } catch (err) {
            console.error(err);
        }


        // try {
        //     const output = await selectedAddress;
        //     this.state.username = output['_address'];
        //     this.state.pub_key = public_key;
        //     this.props.updateData(this.state.username);
        // } catch (e) {
        //     if (e instanceof TvmException) {
        //         console.error(e.code);
        //     }
        // }
    }

    render() {
        return (
            <div className="select-username">
                <form onSubmit={this.onSigning}>
                    <input style={{display: "none"}}/>
                    <button>LOGIN</button>
                </form>
            </div>
        );
    }
}