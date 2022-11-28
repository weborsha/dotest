module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
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
        nick: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        pubkey: {
            type: Sequelize.STRING(70),
            allowNull: true
        },
        connected: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        nonce: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    }, {timestamps: false});

    return User;
};