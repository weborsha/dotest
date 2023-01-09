import React, {Component} from "react";
import {Address, ProviderRpcClient, TvmException} from "everscale-inpage-provider";
import './App.css';

const API_URL = "process.env.REACT_APP_API_URL";
const ever = new ProviderRpcClient();

const tokenWalletAbi =
    {
        "ABI version": 2,
        "version": "2.2",
        "header": ["pubkey", "time", "expire"],
        "functions": [
            {
                "name": "constructor",
                "inputs": [
                ],
                "outputs": [
                ]
            },
            {
                "name": "supportsInterface",
                "inputs": [
                    {"name":"answerId","type":"uint32"},
                    {"name":"interfaceID","type":"uint32"}
                ],
                "outputs": [
                    {"name":"value0","type":"bool"}
                ]
            },
            {
                "name": "destroy",
                "inputs": [
                    {"name":"remainingGasTo","type":"address"}
                ],
                "outputs": [
                ]
            },
            {
                "name": "burnByRoot",
                "inputs": [
                    {"name":"amount","type":"uint128"},
                    {"name":"remainingGasTo","type":"address"},
                    {"name":"callbackTo","type":"address"},
                    {"name":"payload","type":"cell"}
                ],
                "outputs": [
                ]
            },
            {
                "name": "burn",
                "inputs": [
                    {"name":"amount","type":"uint128"},
                    {"name":"remainingGasTo","type":"address"},
                    {"name":"callbackTo","type":"address"},
                    {"name":"payload","type":"cell"}
                ],
                "outputs": [
                ]
            },
            {
                "name": "balance",
                "inputs": [
                    {"name":"answerId","type":"uint32"}
                ],
                "outputs": [
                    {"name":"value0","type":"uint128"}
                ]
            },
            {
                "name": "owner",
                "inputs": [
                    {"name":"answerId","type":"uint32"}
                ],
                "outputs": [
                    {"name":"value0","type":"address"}
                ]
            },
            {
                "name": "root",
                "inputs": [
                    {"name":"answerId","type":"uint32"}
                ],
                "outputs": [
                    {"name":"value0","type":"address"}
                ]
            },
            {
                "name": "walletCode",
                "inputs": [
                    {"name":"answerId","type":"uint32"}
                ],
                "outputs": [
                    {"name":"value0","type":"cell"}
                ]
            },
            {
                "name": "transfer",
                "inputs": [
                    {"name":"amount","type":"uint128"},
                    {"name":"recipient","type":"address"},
                    {"name":"deployWalletValue","type":"uint128"},
                    {"name":"remainingGasTo","type":"address"},
                    {"name":"notify","type":"bool"},
                    {"name":"payload","type":"cell"}
                ],
                "outputs": [
                ]
            },
            {
                "name": "transferToWallet",
                "inputs": [
                    {"name":"amount","type":"uint128"},
                    {"name":"recipientTokenWallet","type":"address"},
                    {"name":"remainingGasTo","type":"address"},
                    {"name":"notify","type":"bool"},
                    {"name":"payload","type":"cell"}
                ],
                "outputs": [
                ]
            },
            {
                "name": "acceptTransfer",
                "id": "0x67A0B95F",
                "inputs": [
                    {"name":"amount","type":"uint128"},
                    {"name":"sender","type":"address"},
                    {"name":"remainingGasTo","type":"address"},
                    {"name":"notify","type":"bool"},
                    {"name":"payload","type":"cell"}
                ],
                "outputs": [
                ]
            },
            {
                "name": "acceptMint",
                "id": "0x4384F298",
                "inputs": [
                    {"name":"amount","type":"uint128"},
                    {"name":"remainingGasTo","type":"address"},
                    {"name":"notify","type":"bool"},
                    {"name":"payload","type":"cell"}
                ],
                "outputs": [
                ]
            },
            {
                "name": "sendSurplusGas",
                "inputs": [
                    {"name":"to","type":"address"}
                ],
                "outputs": [
                ]
            }
        ],
        "data": [
            {"key":1,"name":"root_","type":"address"},
            {"key":2,"name":"owner_","type":"address"}
        ],
        "events": [
        ],
        "fields": [
            {"name":"_pubkey","type":"uint256"},
            {"name":"_timestamp","type":"uint64"},
            {"name":"_constructorFlag","type":"bool"},
            {"name":"root_","type":"address"},
            {"name":"owner_","type":"address"},
            {"name":"balance_","type":"uint128"}
        ]
    }

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: '',
            withdrawal_address: '',
            tokenName: 'BTC'
        };
        this.handleChange = this.handleChange.bind(this);
        this.burnTokens = this.burnTokens.bind(this);
        this.mintTokens = this.mintTokens.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        this.setState({[name]: event.target.value});
    }

    async getTokenWallet(address) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let graphql = JSON.stringify({
            query: 'query{accounts(filter: {id: {eq:"'+address+'"}}) {tokenHolder {wallets {nodes {address token {address symbol rootOwner standard name}}}}}}',
            variables: {}
        })
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: graphql,
            redirect: 'follow'
        };
        let response =  await fetch("https://devnet.evercloud.dev/01a10ad7a0714daabf6f8fdae72a32a6/graphql", requestOptions);
        if (response.ok) { // если HTTP-статус в диапазоне 200-299
                           // получаем тело ответа (см. про этот метод ниже)
            let json = await response.json();
            return json;
        } else {
            alert("Ошибка HTTP: " + response.status);
        }
    }

    async burnTokens(event) {
        event.preventDefault();

        if (!(await ever.hasProvider())) {
            throw new Error('Extension is not installed');
        }

        const { accountInteraction } = await ever.requestPermissions({
            permissions: ['basic', 'accountInteraction'],
        });
        if (accountInteraction == null) {
            throw new Error('Insufficient permissions');
        }

        await ever.changeAccount();

        const selectedAddress = accountInteraction.address;

        const tokenWalletAddressJson = await this.getTokenWallet(selectedAddress);
        const tokenWalletAddressJsonFind = tokenWalletAddressJson['data']['accounts'][0]['tokenHolder']['wallets']['nodes'];

        //Change address RootToken
        const tokenWalletAddress = tokenWalletAddressJsonFind.find(({ token }) => token.address === process.env.REACT_APP_TOKEN_ROOT);

        const dePoolAddress = new Address(tokenWalletAddress.address);

        const receivePool = new ever.Contract(tokenWalletAbi, dePoolAddress);

        let amount = this.state.amount * 100000000;

        const transaction = await receivePool
            .methods.burn({
                amount: amount,
                remainingGasTo: selectedAddress,
                callbackTo: '0:0000000000000000000000000000000000000000000000000000000000000000',
                payload: ''
            }).send({
                from: selectedAddress,
                amount: '100000000',
                bounce: true,
            });
        console.log(transaction);
        try {
            let myHeaders = new Headers();
            myHeaders.append("x-access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY5NjQxNjYwLCJleHAiOjE2Njk3MjgwNjB9.IxZWjtlp18WXiCcrxJuFgeywj-hFPj5uGJLKd938Rl0");
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            let urlencoded = new URLSearchParams();

            //input withdrawal_address and token_name
            urlencoded.append("withdrawal_address", this.state.withdrawal_address);
            urlencoded.append("token_name", this.state.tokenName);

            urlencoded.append("user_address", transaction.outMessages[0].src._address);
            urlencoded.append("tx_hash", transaction.outMessages[0].hash);

            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            fetch(`${API_URL}/api/user/withdrawal/check`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

        } catch (e) {
            if (e instanceof TvmException) {
                console.error(e.code);
            }
        }
    }
    
    render() {
        return (
            <div className="App">
                <div className="burn-tokens">
                    <form onSubmit={this.burnTokens}>
                        <label>
                            Select cryptocurrency name:
                            <select name="tokenName" value={this.state.tokenName} onChange={this.handleChange}>
                                <option value="BTC">Bitcoin</option>
                                <option value="ETH">Ethereum</option>
                                <option value="BNB">Binance</option>
                                <option value="everscale">Everscale</option>
                            </select>
                        </label>
                        <label>
                            Withdrawal address:
                            <input name="withdrawal_address" type="text" value={this.state.withdrawal_address} onChange={this.handleChange} />
                        </label>
                        <label>
                            Amount tokens to withdraw:
                            <input name="amount" type="text" value={this.state.amount} onChange={this.handleChange} />
                        </label>
                        <input type="submit" value="Withdraw" />
                    </form>
                </div>
            </div>
        );
    }
}
