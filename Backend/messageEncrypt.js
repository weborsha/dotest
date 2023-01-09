/* abstract */
class MessageEncrypt {
  encryptMessage(message) {
  }

  findMessagesForUser(message) {
  }
}

const CryptoJS = require("crypto-js");
require('dotenv').config();

const mysql = require('mysql2');
const con = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
    const key = process.env.MSG_SECRET;
    return CryptoJS.AES.encrypt(text, key).toString();
  }

  async findMessagesForUser(userID) {
    let user_messages_rows = await query('SELECT `content`, `address_from`, `address_to`, `time` FROM `history` WHERE `address_from` = ? OR `address_to` = ?', [userID, userID]);
    let user_messages = await user_messages_rows;

    this.messages = await Promise.all(user_messages.map(async item => {
      const text = item.content;
      const key = process.env.MSG_SECRET;

      let decrypted = CryptoJS.AES.decrypt(text, key);
      item.content = await decrypted.toString(CryptoJS.enc.Utf8);

      return {content: item.content, from: item.address_from, to: item.address_to, time: item.time};
    }));

    return this.messages.filter(
        ({from, to}) => from === userID || to === userID
    );
  }

}

module.exports = {
  InMessageEncrypt,
};
