const axios = require('axios');
const db = require("../models");
const DepositHistoryEth = db.deposit_history_eth;

exports.depositEthCheck = async (req, res) => {
    if (req.body.confirmed === true && req.body.streamId === '4abb4dd9-ca95-49c2-84ac-23ce8b60ebe4') {

        let bnb_price = axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
        console.log(bnb_price);

        let config = {
            method: 'get',
            url: 'https://deep-index.moralis.io/api/v2/transaction/' + req.body.txs[0].hash + '?chain=' + req.body.chainId,
            headers: {
                'X-API-Key': 'AZV0avIB7qdAVVLrHtJCbnPM1yVBp5WuprODCrZ685LyVMbXaTVGZUQfu7B3RG5p'
            }
        };
        axios(config)
            .then(async function (response) {
                //console.log(JSON.stringify(response.data));
                let amount = req.body.txs[0].value / 1000000000000000000;
                await DepositHistoryEth.create({
                    user_address: response.from_address,
                    deposit_address: '43gg43h43h',
                    amount: amount,
                    eth_rate: '10.15454'
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        res.status(200).send("ok");
    } else {
        res.status(200).send("not ok");
    }
};

