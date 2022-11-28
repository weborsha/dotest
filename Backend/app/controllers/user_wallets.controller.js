//const { Op } = require("sequelize");
const db = require("../models");
//const config = require("../config/auth.config");

const UserWallets = db.user_wallets;

exports.userWallet = async (req, res) => {
  const wallets = await UserWallets.findAll({
    where: {
      id: req.userId
    }
  });
  res.status(200).send(wallets);
};

