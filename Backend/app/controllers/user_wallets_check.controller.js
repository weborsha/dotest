const axios = require('axios');
const db = require("../models");
const DepositHistoryEth = db.deposit_history_eth;
const DepositHistoryBnb = db.deposit_history_bnb;

exports.depositEthCheck = async (req, res) => {
    if (req.body.confirmed === true && req.body.streamId === '4abb4dd9-ca95-49c2-84ac-23ce8b60ebe4') {
        let token_name = '';
        let model_name = '';
        if (req.body.chainId === '0x61' || req.body.chainId === '0x38') {
            token_name = 'binancecoin';
            model_name = DepositHistoryBnb;
        }
        if (req.body.chainId === '0x1') {
            token_name = 'ethereum';
            model_name = DepositHistoryEth;
        }
        let token_price = axios.get('https://api.coingecko.com/api/v3/simple/price?ids=' + token_name + '&vs_currencies=usd');

        let tx_check = axios({
            method: 'get',
            url: 'https://deep-index.moralis.io/api/v2/transaction/' + req.body.txs[0].hash + '?chain=' + req.body.chainId,
            headers: {
                'X-API-Key': 'AZV0avIB7qdAVVLrHtJCbnPM1yVBp5WuprODCrZ685LyVMbXaTVGZUQfu7B3RG5p'
            }
        });
        axios.all([token_price, tx_check])
            .then(
                axios.spread(async (...responses) => {
                    console.log(token_name);
                    let token_rate = responses[0].data[token_name]['usd'];
                    let amount = req.body.txs[0].value / 1000000000000000000;
                    await model_name.create({
                        deposit_address: responses[1].data.to_address,
                        amount: amount,
                        token_rate: token_rate
                    });
                })
            )
            .catch(errors => {
                // react on errors.
                console.error(errors);
            });
        res.status(200).send("ok");
    } else {
        res.status(200).send("not ok");
    }
};

