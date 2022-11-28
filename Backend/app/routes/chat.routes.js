const {authJwt} = require("../middleware");

const {InMysqlUsersStore} = require("../../usersStoreMysql");
const usersStoreMysql = new InMysqlUsersStore();

//Crypt message
const {InMessageEncrypt} = require("../../messageEncrypt");
const messageEncrypt = new InMessageEncrypt();


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

module.exports = function (app, io) {
    [authJwt.verifyToken],
        io.use(async (socket, next) => {
            if (socket.handshake.auth) {
                let sessionID = '';
                if (socket.handshake.auth.sessionID) {
                    sessionID = socket.handshake.auth.sessionID;
                }
                if (sessionID) {
                    const session = await usersStoreMysql.findUsers(sessionID);
                    if (session) {
                        socket.sessionID = session.userID;
                        socket.userID = session.userID;
                        socket.username = session.username;
                        socket.connected = (session.connected === 1);
                        return next();
                    }
                }
                const username = socket.handshake.auth.username;
                if (!username) {
                    return next(new Error("invalid username"));
                }
            } else {
                next(new Error('Authentication error'));
            }
        });

// Socket.io
    io.on("connection", async (socket) => {

        usersStoreMysql.saveUserStatusConnect(socket.sessionID);
        // emit session details
        socket.emit("session", {
            sessionID: socket.userID,
            userID: socket.userID,
        });

        // join the "userID" room
        socket.join(socket.userID);

        // fetch existing users
        const users = [];
        const messagesPerUser = new Map();

        //Find message in Mysql
        let messageForUser = await messageEncrypt.findMessagesForUser(socket.userID);
        messageForUser.forEach((message) => {
            const {from, to} = message;
            const otherUser = socket.userID === from ? to : from;
            if (messagesPerUser.has(otherUser)) {
                messagesPerUser.get(otherUser).push(message);
            } else {
                messagesPerUser.set(otherUser, [message]);
            }
        });

        let usersWithHistory = await usersStoreMysql.findAllUsersInteraction(socket.userID);
        //console.log(usersWithHistory);
        usersWithHistory.forEach((session) => {
            //console.log(session);
            users.push({
                userID: session.userID,
                username: session.username,
                connected: (session.connected === 1),
                in_blacklist: (session.in_blacklist === 1),
                messages: messagesPerUser.get(session.userID) || [],
            });
        });
        socket.emit("users", users);

        // notify existing users
        socket.broadcast.emit("user connected", {
            userID: socket.userID,
            username: socket.username,
            connected: true,
            messages: [],
        });

        // forward the private message to the right recipient (and to other tabs of the sender)
        socket.on("private message", async ({content, to}) => {
            const message = {
                content,
                from: socket.userID,
                to,
            };

            //Blacklist crypt and save message
            let check_available_send = await usersStoreMysql.checkBlacklistStatus(message['to'], message['from']);
            if (check_available_send.length === 0) {
                socket.to(to).to(socket.userID).emit("private message", message);
                let encrypt_content = await messageEncrypt.encryptMessage(message['content'], message['from']);
                con.query("INSERT INTO `history` (address_from, address_to, content) VALUES (?, ?, ?)", [message['from'], message['to'], encrypt_content]);
            }

        });
        socket.on("add to blacklist", (to) => {
            let user = socket.userID;
            //socket.to(to).to(socket.userID).emit("private message", message);
            con.query("INSERT INTO `blacklist` (user, blocked_user) VALUES (?, ?)", [user, to]);
        });
        socket.on("remove from blacklist", (to) => {
            let user = socket.userID;
            usersStoreMysql.removeFromBlacklist(user, to);
        });

        // notify users upon disconnection
        socket.on("disconnect", async () => {
            const matchingSockets = await io.in(socket.userID).allSockets();
            const isDisconnected = matchingSockets.size === 0;
            if (isDisconnected) {
                // notify other users
                socket.broadcast.emit("user disconnected", socket.userID);
                usersStoreMysql.saveUserStatusDisconnect(socket.sessionID);
            }
        });
    });
}