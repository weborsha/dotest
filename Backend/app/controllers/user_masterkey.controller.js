//const { Op } = require("sequelize");
const db = require("../models");
const CryptoJS = require("crypto-js");
//const config = require("../config/auth.config");

const User = db.user;
const UserKeys = db.user_keys;

const user_master_key_decrypt = async (seed, user_id) => {
  let pub_key_from = await User.findAll({
    attributes: ['pubkey'],
    where: {
      id: user_id
    }
  });
  let key = CryptoJS.enc.Utf8.parse(pub_key_from[0]['pubkey']);
  let decrypted = CryptoJS.AES.decrypt({ciphertext: CryptoJS.enc.Hex.parse(seed)}, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding
  });
  //let master_key = await decrypted.toString(CryptoJS.enc.Utf8);
  let master_key = await CryptoJS.enc.Utf8.stringify(decrypted);
  //console.log(master_key[0]);
  return master_key;
}


exports.userMaster = async (req, res) => {
  const master_key = await UserKeys.findAll({
    where: {
      id: req.userId
    }
  });

  let ever_privateSeed_decrypt = await user_master_key_decrypt(master_key[0].seed, req.userId)

  ever_privateSeed_decrypt = ever_privateSeed_decrypt.toString()
  //console.log(master_key[0].seed);
  res.status(200).send({master_key: ever_privateSeed_decrypt});
};

