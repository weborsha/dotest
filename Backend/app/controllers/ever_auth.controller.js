const {ProviderRpcClient} = require('everscale-inpage-provider');
const {EverscaleStandaloneClient} = require('everscale-standalone-client/nodejs');

const ethers = require('ethers');
const crypto = require('crypto');
const CryptoJS = require("crypto-js");
const bitcore = require('bitcore-lib');

const axios = require('axios');
const qs = require('qs');

const db = require("../models");
const config = require("../config/auth.config");

const User = db.user;
const AuthDetail = db.authdetail;
const UserKeys = db.user_keys;
const UserWallets = db.user_wallets;
const AdminEth = db.admin_eth;
const AdminBtc = db.admin_btc;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var moment = require('moment');

const {TonClient, CryptoModule} = require("@eversdk/core");
const {libNode} = require("@eversdk/lib-node");

TonClient.useBinaryLibrary(libNode);


const ever = new ProviderRpcClient({
    fallback: () =>
        EverscaleStandaloneClient.create({
            connection: 'mainnetJrpc'
        }),
});

const getRandomNonceMessage = (nonce) => {
    return 'Please prove you control this wallet by signing this random text: ' + nonce;
}


const encryptUserSeed = async (seed, address) => {
    let text = CryptoJS.enc.Utf8.parse(seed.phrase);
    const pub_key_from = await User.findAll({
        attributes: ['pubkey'],
        where: {
            address: address
        }
    });
    const key = CryptoJS.enc.Utf8.parse(pub_key_from[0]['pubkey']);
    let encrypted = CryptoJS.AES.encrypt(text, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.ZeroPadding});
    encrypted = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    return encrypted;
}

const checkEthChain = async (address) => {
    let data = qs.stringify({
        'address': address
    });
    let config = {
        method: 'post',
        url: 'https://api.moralis-streams.com/streams/evm/4abb4dd9-ca95-49c2-84ac-23ce8b60ebe4/address',
        headers: {
            'x-api-key': 'AZV0avIB7qdAVVLrHtJCbnPM1yVBp5WuprODCrZ685LyVMbXaTVGZUQfu7B3RG5p',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}


exports.auth_challenge_ever = async (req, res) => {
    //console.log(req.body);
    const address = req.body.address.toLowerCase();
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const unix = moment().unix();

    const t = await db.sequelize.transaction();
    try {
        //load by user address (if not found, create new user)
        const [user, user_created] = await User.findOrCreate({
            where: {address: address},
            defaults: {address: address},
            include: [
                {model: AuthDetail, as: "AuthDetail"},
                {model: UserKeys, as: "UserKeys"},
                {model: UserWallets, as: "UserWallets"}
            ],
            transaction: t
        });

        if (user_created) {
            //create new authdetail
            const authDetail = await AuthDetail.create({nonce: nonce, timestamp: unix});
            await user.setAuthDetail(authDetail, {transaction: t});

            //create master key
            const client = new TonClient();
            const {phrase} = await client.crypto.mnemonic_from_random({dictionary: 1, word_count: 12});
            let ever_privateSeed_encrypt = await encryptUserSeed(phrase, address)
            await UserKeys.create({address: address, seed: ever_privateSeed_encrypt});
            //const userKeys = await UserKeys.create({ address:address, seed:phrase });
            //await user.setUserKeys(userKeys, {transaction: t });

            //create eth
            let id = crypto.randomBytes(32).toString('hex');
            let eth_privateKey = "0x" + id;
            let wallet_eth = new ethers.Wallet(eth_privateKey);

            //create btc
            let btc_privateKey = new bitcore.PrivateKey();
            let btc_privateKey_admin = btc_privateKey.toString();
            let wallet_btc = (btc_privateKey.toAddress()).toString();

            await UserWallets.create({
                address: address,
                ever: '43gg43h43h',
                btc: wallet_btc,
                eth: wallet_eth.address,
                bnb: wallet_eth.address
            });
            await AdminEth.create({address: wallet_eth.address, private: eth_privateKey});
            await AdminBtc.create({address: wallet_btc, private: btc_privateKey_admin});

        } else {
            //update existing authdetail
            user.AuthDetail.set({nonce: nonce, timestamp: unix});
            await user.AuthDetail.save({transaction: t});

            //It's for test
            //create eth/bnb
            let id = crypto.randomBytes(32).toString('hex');
            let eth_privateKey = "0x" + id;
            let wallet_eth = new ethers.Wallet(eth_privateKey);

            //create btc
            let btc_privateKey = new bitcore.PrivateKey();
            let wallet_btc = (btc_privateKey.toAddress()).toString();

            //create ever
            let client = new TonClient();
            let ever_privateSeed = await client.crypto.mnemonic_from_random({dictionary: 1, word_count: 12});
            //console.log(ever_privateSeed);
            let ever_privateSeed_encrypt = await encryptUserSeed(ever_privateSeed, address)
            await UserKeys.create({address: address, seed: ever_privateSeed_encrypt});

            await checkEthChain(wallet_eth.address);

            await UserWallets.create({
                address: address,
                ever: '43gg43h43h',
                btc: wallet_btc,
                eth: wallet_eth.address,
                bnb: wallet_eth.address
            });
            //await AdminBtc.create({ address:wallet_btc, private:btc_privateKey_admin });
        }

        await t.commit();
        res.status(200).send({message: getRandomNonceMessage(nonce)});

    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).send({message: error.message});
    }
}

exports.auth_verify_ever = async (req, res) => {
    const address = req.body.address.toLowerCase();
    const signature = req.body.signature;
    const publicKey = req.body.publicKey;
    const dataHash = req.body.dataHash;
    try {
        //load user by public address
        const user = await User.findOne({where: {address: address}, include: {model: AuthDetail, as: "AuthDetail"}});
        if (!user) return res.status(401).send({message: "User Not found."});

        //get authdetails for user
        const nonce = user.AuthDetail.nonce;
        const timestamp_challenge = user.AuthDetail.timestamp;

        //check time difference
        var diff_sec = moment().diff(moment.unix(timestamp_challenge), 'seconds');
        if (diff_sec > 300) return res.status(401).send({message: "The challenge must have been generated within the last 5 minutes"});

        const checksign = await ever.verifySignature({
            publicKey: publicKey,
            dataHash: dataHash,
            signature: signature
        })
        //console.log(checksign)

        var token = jwt.sign({id: user.id}, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        res.status(200).send({
            address: user.address,
            accessToken: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({message: error.message});
    }
}