import React from "react";

//import { ethers } from "ethers";
import {ProviderRpcClient} from "everscale-inpage-provider";

import {NoWalletDetected} from "./NoWalletDetected";
import {ConnectWallet} from "./ConnectWallet";
import {Loading} from "./Loading";
import {Login} from "./Login";
import {TestAuthorisation} from "./TestAuthorisation";

const HARDHAT_NETWORK_ID = '31337';
const API_URL = "http://localhost:8080"
const ever = new ProviderRpcClient();

export class Dapp extends React.Component {
    constructor(props) {
        super(props);

        // We store multiple things in Dapp's state.
        // You don't need to follow this pattern, but it's a useful example.
        this.initialState = {

            // The user's address and balance
            selectedAddress: undefined,
            balance: undefined,
            networkError: undefined,
            loggedIn: false,
            loading: false,
            authorisedData: ''
        };

        this.state = this.initialState;
    }

    render() {
        // if (window.ethereum === undefined) {
        //   return <NoWalletDetected />;
        // }


        if (!this.state.selectedAddress) {
            return (
                <ConnectWallet
                    //connectWallet={() => this._connectWallet()}
                    connectWallet={() => this._connectEver()}
                    networkError={this.state.networkError}
                    dismiss={() => this._dismissNetworkError()}
                />
            );
        }

        if (this.state.loading) {
            return (
                <Loading/>
            )
        }


        if (!this.state.loggedIn) {
            return (
                <Login login={() => this._loginEver()}/>
            );
        }


        // If everything is loaded, we render the application.
        return (
            <div className="container p-4">
                <div className="row">
                    <div className="col-12">
                        <h1>Welcome</h1>
                        <p>JWT TOKEN: {window.localStorage.getItem("TOKEN")}</p>

                        {
                            this.state.authorisedData === '' ? (
                                <TestAuthorisation getAuthorisedData={() => this._getAuthorisedData()}/>
                            ) : (
                                <p>{this.state.authorisedData}</p>
                            )
                        }

                    </div>
                </div>
            </div>
        );
    }


    async _getAuthorisedData() {
        this.setState({
            loading: true,
        });

        //fetch message
        const res = await fetch(`${API_URL}/api/test/user`, {
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

    async _loginEver() {
        this.setState({
            loading: true,
        });
        //fetch message
        const authChallengeRes = await fetch(`${API_URL}/api/auth/authChallengeEver`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'address': this.state.selectedAddress})
        });

        const contentAuthChallenge = await authChallengeRes.json();
        //const message = contentAuthChallenge.message;
        const message = contentAuthChallenge.message;

        //request signature
        try {
            //const from = this.state.selectedAddress;
            //const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
            // const sign = await window.ethereum.request({
            //   method: 'personal_sign',
            //   params: [msg, from, ''],
            // });

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

            //console.log(sign)
            //try authentication

            //   const checksign = await ever.verifySignature({
            //         publicKey: accountInteraction.publicKey,
            //         dataHash: sign.dataHash,
            //         signature: sign.signature
            //   })
            // console.log(checksign)

            const authVerifyRes = await fetch(`${API_URL}/api/auth/auth_verifyEver`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'address': this.state.selectedAddress,
                    'signature': sign.signature,
                    'publicKey': accountInteraction.publicKey,
                    'dataHash': sign.dataHash
                })
            });

            const contentAuthVerify = await authVerifyRes.json();
            const token = contentAuthVerify.accessToken;
            window.localStorage.setItem("TOKEN", token);

            //console.log(window.localStorage.getItem("TOKEN"));

            this.setState({
                loggedIn: true,
                loading: false
            });

        } catch (err) {
            console.error(err);
        }
    }

    // async _login() {
    //   this.setState({
    //     loading: true,
    //   });
    //   //fetch message
    //   const authChallengeRes = await fetch(`${API_URL}/api/auth/authChallenge`, {
    //     method: 'POST',
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ 'address': this.state.selectedAddress })
    //   });
    //
    //   const contentAuthChallenge = await authChallengeRes.json();
    //
    //   //request signature
    //   const message = contentAuthChallenge.message;
    //   try {
    //     const from = this.state.selectedAddress;
    //     const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
    //     const sign = await window.ethereum.request({
    //       method: 'personal_sign',
    //       params: [msg, from, ''],
    //     });
    //
    //     console.log("OK SIGNED")
    //     //try authentication
    //
    //     const authVerifyRes = await fetch(`${API_URL}/api/auth/auth_verify`, {
    //       method: 'POST',
    //       headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({ 'address': this.state.selectedAddress, 'signature': sign })
    //     });
    //
    //     const contentAuthVerify = await authVerifyRes.json();
    //     const token = contentAuthVerify.accessToken;
    //     window.localStorage.setItem("TOKEN", token);
    //
    //     console.log(window.localStorage.getItem("TOKEN"));
    //
    //     this.setState({
    //       loggedIn: true,
    //       loading: false
    //     });
    //
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }

    async _connectEver() {
        //event.preventDefault();

        if (!(await ever.hasProvider())) {
            throw new Error('Extension is not installed');
        }
        const {accountInteraction} = await ever.requestPermissions({
            permissions: ['basic', 'accountInteraction'],
        });
        if (accountInteraction == null) {
            throw new Error('Insufficient permissions');
        }
        //const [selectedAddress] = accountInteraction.address._address;

        // First we check the network
        // if (!this._checkNetwork()) {
        //   return;
        // }

        this.setState({
            selectedAddress: accountInteraction.address._address,
        });

        //console.log(this.state.selectedAddress);
    }

    async _connectWallet() {
        //const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //this._initialize(selectedAddress);

        // We reinitialize it whenever the user changes their account.
        window.ethereum.on("accountsChanged", ([newAddress]) => {
            this._stopPollingData();
            // `accountsChanged` event can be triggered with an undefined newAddress.
            // This happens when the user removes the Dapp from the "Connected
            // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
            // To avoid errors, we reset the dapp state
            if (newAddress === undefined) {
                return this._resetState();
            }

            this._initialize(newAddress);
        });

        // We reset the dapp state if the network is changed
        window.ethereum.on("chainChanged", ([networkId]) => {
            this._stopPollingData();
            this._resetState();
        });
    }


    // This method just clears part of the state.
    _dismissNetworkError() {
        this.setState({networkError: undefined});
    }

    // This is a utility method that turns an RPC error into a human-readable
    // message.
    _getRpcErrorMessage(error) {
        if (error.data) {
            return error.data.message;
        }

        return error.message;
    }

    // This method resets the state
    _resetState() {
        this.setState(this.initialState);
    }

    // This method checks if Metamask selected network is Localhost:8545
    _checkNetwork() {
        if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
            return true;
        }

        this.setState({
            networkError: 'Please connect Metamask to Localhost:8545'
        });

        return false;
    }
}
