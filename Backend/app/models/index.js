const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,

        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);


//Test the DB Connection
sequelize.authenticate()
    .then(() => console.log('Database Connected'))
    .catch(err => console.log('Error: ', err))

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.authdetail = require("./authDetail.model.js")(sequelize, Sequelize);
db.user_keys = require("./userKeys.model.js")(sequelize, Sequelize);
db.user_wallets = require("./userWallets.model.js")(sequelize, Sequelize);
db.admin_eth = require("./adminEth.model.js")(sequelize, Sequelize);
db.admin_btc = require("./adminBtc.model.js")(sequelize, Sequelize);
db.deposit_history_eth = require("./depositEth.model.js")(sequelize, Sequelize);
db.deposit_history_bnb = require("./depositBnb.model.js")(sequelize, Sequelize);


//create foreign key authdetails_id_fk in users table
db.user.belongsTo(db.authdetail, {as: "AuthDetail", foreignKey: 'authdetails_id_fk'});
db.user.belongsTo(db.user_keys, {as: "UserKeys", foreignKey: 'id'});
db.user.belongsTo(db.user_wallets, {as: "UserWallets", foreignKey: 'id'});

//db.role.belongsToMany(db.user, {through: "user_roles", foreignKey: "roleId", otherKey: "userId"});
//db.user.belongsTo(db.role, {as: "UserRole", foreignKey: "id"});


module.exports = db;
