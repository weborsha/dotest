//const { Op } = require("sequelize");
const db = require("../models");
//const config = require("../config/auth.config");

const UserWallets = db.user_wallets;

exports.userWallet = async (req, res) => {
  //console.log(req.body);
  await UserWallets.create({address: 'test', ever: '43gg43h43h', btc: 'test', eth: 'test', bnb: 'test'});
  res.status(200).send("ok");
};

