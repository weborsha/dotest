//const { Op } = require("sequelize");
const db = require("../models");
const CryptoJS = require("crypto-js");
//const config = require("../config/auth.config");

const User = db.user;
const UserKeys = db.user_keys;

const user_master_key_decrypt = async (seed) => {
  let key = CryptoJS.enc.Utf8.parse(process.env.MASTERKEY_SECRET);
  let decrypted = CryptoJS.AES.decrypt({ciphertext: CryptoJS.enc.Hex.parse(seed)}, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding
  });
  //let master_key = await decrypted.toString(CryptoJS.enc.Utf8);
  //console.log(master_key[0]);
  return await CryptoJS.enc.Utf8.stringify(decrypted);
}


exports.userMaster = async (req, res) => {
  const userAddress = await User.findAll({
    attributes: ['address'],
    where: {
      id: req.userId
    }
  });

  const master_key = await UserKeys.findAll({
    where: {
      address: userAddress[0]['address']
    }
  });

  let ever_privateSeed_decrypt = await user_master_key_decrypt(master_key[0].seed)

  ever_privateSeed_decrypt = ever_privateSeed_decrypt.toString()
  //console.log(master_key[0].seed);
  res.status(200).send({master_key: ever_privateSeed_decrypt});
};

