/* abstract */
class MessageEncrypt {
  encryptMessage(message) {
  }

  findMessagesForUser(message) {
  }
}

const CryptoJS = require("crypto-js");

const mysql = require('mysql2');
const con = mysql.createPool({
  host: '62.171.173.82',
  user: 'esgnode_evstats',
  password: 'P^j6NN7Q~*xn',
  database: 'esgnode_evstats',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const util = require('util');
const query = util.promisify(con.query).bind(con);


class InMessageEncrypt extends MessageEncrypt {
  constructor() {
    super();
    this.messages = [];
  }

  async encryptMessage(message, address) {
    let text = message;
    const pub_key_from = await query('SELECT pubkey FROM `users` WHERE `address` = ?', [address]);

    text = CryptoJS.enc.Utf8.parse(text);
    const key = CryptoJS.enc.Utf8.parse(pub_key_from[0]['pubkey']);

    let encrypted = CryptoJS.AES.encrypt(text, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.ZeroPadding});
    encrypted = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    //console.log('encrypted', key);
    return encrypted;
  }

  async findMessagesForUser(userID) {
    let user_messages_rows = await query('SELECT `content`, `address_from`, `address_to`  FROM `history` WHERE `address_from` = ? OR `address_to` = ?', [userID, userID]);
    let user_messages = await user_messages_rows;

    let user_messages_decrypt = await Promise.all(user_messages.map(async item => {
      const pub_key_from = await query('SELECT pubkey FROM `users` WHERE `address` = ?', [item.address_from]);
      const text = item.content;
      const key = CryptoJS.enc.Utf8.parse(pub_key_from[0]['pubkey']);
      let decrypted = CryptoJS.AES.decrypt({ciphertext: CryptoJS.enc.Hex.parse(text)}, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.ZeroPadding
      });
      item.content = await decrypted.toString(CryptoJS.enc.Utf8);
      return {content: item.content, from: item.address_from, to: item.address_to};
    }));

    this.messages = user_messages_decrypt;

    return this.messages.filter(
        ({from, to}) => from === userID || to === userID
    );
  }

}

module.exports = {
  InMessageEncrypt,
};
