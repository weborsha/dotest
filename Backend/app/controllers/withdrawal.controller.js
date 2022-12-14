const axios = require('axios');
const db = require("../models");
const WithdrawalHistory = db.withdrawal_history;

exports.withdrawalCheck = async (req, res) => {
    if (req.body) {
        let token_price;
        let token_name = req.body.token_name;
        console.log(token_name);
        if (token_name === 'everscale') {
            token_price = axios.get('https://api.coingecko.com/api/v3/simple/price?ids=everscale&vs_currencies=usd');
        } else {
            token_price = axios.get('https://api.binance.com/api/v3/avgPrice?symbol=' + token_name + 'USDT');
        }

        let tx_hash = await req.body.tx_hash;
        let data_check = JSON.stringify({
            query: `query{
  blockchain{
    message(hash:"` + tx_hash + `") {
      dst_transaction {
        status
      	tokenTransfer {
        value
      }
      }
    }
  }
}`
        });
        let tx_check = axios({
            method: 'post',
            url: 'https://devnet.evercloud.dev/01a10ad7a0714daabf6f8fdae72a32a6/graphql',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data_check
        });
        axios.all([token_price, tx_check])
            .then(
                axios.spread(async (...responses) => {
                    //console.log(responses[1].data.data.blockchain.message.dst_transaction.tokenTransfer.value);
                    let token_rate = '';
                    if (token_name === 'everscale') {
                        token_rate = responses[0].data['everscale']['usd'];
                    } else {
                        token_rate = responses[0].data['price'];
                    }
                    let amount = responses[1].data.data.blockchain.message.dst_transaction.tokenTransfer.value / 100000000;
                    let amount_token = amount / token_rate;
                    await WithdrawalHistory.create({
                        user_address: req.body.user_address,
                        withdrawal_address: req.body.withdrawal_address,
                        amount: amount,
                        amount_token: amount_token,
                        token_name: token_name,
                        token_rate: token_rate,
                        tx_hash: req.body.tx_hash
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