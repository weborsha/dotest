module.exports = (sequelize, Sequelize) => {
    const UserWallets = sequelize.define("user_wallets", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        address: {
            type: Sequelize.STRING(70),
            allowNull: false,
            unique: true
        },
        ever: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        btc: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        eth: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        bnb: {
            type: Sequelize.STRING(255),
            allowNull: true
        }
    }, {timestamps: false});

    return UserWallets;
};