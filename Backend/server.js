require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();

const {createServer} = require("http");
const httpServer = createServer(app);
const io = app.io = require("socket.io")(httpServer, {
    path: '/api/chat',
    cors: {
        origin: ["http://localhost:3000", "http://localhost:8080", "http://192.168.100.21:3000"]
    },
});

const corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));


// database
const db = require("./app/models");
const Role = db.role;

//db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

app.get("/", (req, res) => {
    res.json({message: "Welcome to application."});
});


// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/user_wallets.routes')(app);
require('./app/routes/user_wallets_check.routes')(app);
require('./app/routes/withdrawal.routes')(app);
require('./app/routes/user_masterkey.routes')(app);
require('./app/routes/chat.routes')(app, io);


// set port, listen for requests
const PORT = process.env.APP_PORT;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
