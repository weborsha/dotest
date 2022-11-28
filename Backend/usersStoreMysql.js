/* abstract */
class UsersStoreMysql {
  findUsers(id) {
  }

  saveUser(id, session) {
  }

  findAllUsers() {
  }

  findAllUsersInteraction() {
  }

  saveUserStatusConnect() {
  }

  saveUserStatusDisconnect() {
  }

  addToBlacklist() {
  }

  removeFromBlacklist() {
  }
}

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


class InMysqlUsersStore extends UsersStoreMysql {
  constructor() {
    super();
    this.sessions = new Map();
  }

  // findUsers(id) {
  //   return this.sessions.get(id);
  // }

  // saveUser(id, session) {
  //   this.sessions.set(id, session);
  // }
  saveUserStatusConnect(id) {
    query('UPDATE `users` SET connected = 1 WHERE `address` = ?', [id]);
  }

  saveUserStatusDisconnect(id) {
    query('UPDATE `users` SET connected = 0 WHERE `address` = ?', [id]);
  }

  addToBlacklist(user, blocked_user) {
    query("DELETE FROM `blacklist` WHERE `user` = ? AND `blocked_user` = ?", [user, blocked_user]);
  }

  removeFromBlacklist(user, blocked_user) {
    query('DELETE FROM `blacklist` WHERE `user` = ? AND `blocked_user` = ?', [user, blocked_user]);
  }

  async checkBlacklistStatus(user, blocked_user) {
    try {
      const rows = await query('SELECT * FROM `blacklist` WHERE `user` = ? AND `blocked_user` = ?', [user, blocked_user]);
      //console.log(rows[0]);
      return rows;
    } catch (e) {
      console.log(e);
    }
  }

  async findUsers(userID) {
    try {
      const rows = await query('SELECT address as userID, nick as username, connected FROM `users` WHERE `address` = ?', [userID]);
      //console.log(rows[0]);
      return rows[0];
    } catch (e) {
      console.log(e);
    }
  }

  async findAllUsers() {
    try {
      const rows = await query('SELECT address as userID, nick as username, connected FROM `users`');
      //console.log(rows[0]);
      return rows;
    } catch (e) {
      console.log(e);
    }
  }


  async findAllUsersInteraction(userID) {
    try {
      const all_users_info = await query('SELECT DISTINCT endtable.*, CASE WHEN blacklist.blocked_user IS NULL THEN 0 ELSE 1 END as in_blacklist FROM (SELECT iteration.userID, users.nick AS username, users.connected FROM (SELECT history.address_from AS userID FROM history WHERE history.address_to = ? UNION SELECT history.address_to AS userID FROM history WHERE history.address_from = ?) AS iteration LEFT JOIN users ON iteration.userID = users.address) AS endtable LEFT JOIN blacklist ON endtable.userID = blacklist.blocked_user', [userID, userID]);

      // const filter_iteration = await query('SELECT DISTINCT address_from as userID FROM `history` WHERE `address_to` = ? UNION SELECT DISTINCT address_to as userID FROM `history` WHERE `address_from` = ?', [userID, userID]);
      // const all_users_info = await query('SELECT address as userID, nick as username, connected FROM `users`');
      //
      // //console.log(filter_iteration);
      // let yFilter = filter_iteration.map(itemY => { return itemY.userID; });
      // let filtered_rows = await all_users_info.filter(itemX => yFilter.includes(itemX.userID));
      //
      //
      // const all_blacklist = await query('SELECT `blocked_user` as userID, 1 as in_blacklist FROM `blacklist` WHERE `user` = ?', [userID]);
      // //console.log(all_blacklist);
      // //filtered_rows.set(all_blacklist);
      // const filtered_rows_with_black = filtered_rows.map((y) => Object.assign(y, all_blacklist.find((x) => x.userID === y.userID)));

      //filtered_rows.set('userID','new value');
      //console.log(all_users_info);

      return all_users_info;
    } catch (e) {
      console.log(e);
    }
  }

}

module.exports = {
  InMysqlUsersStore
};
