module.exports = (sequelize, Sequelize) => {
    return sequelize.define("withdrawal_history", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_address: {
            type: Sequelize.STRING(70),
            allowNull: true,
        },
        withdrawal_address: {
            type: Sequelize.STRING(70),
            allowNull: true,
        },
        amount: {
            type: Sequelize.DECIMAL(20, 8),
            allowNull: true,
        },
        amount_token: {
            type: Sequelize.DECIMAL(20, 8),
            allowNull: true,
        },
        token_name: {
            type: Sequelize.STRING(15),
            allowNull: true,
        },
        token_rate: {
            type: Sequelize.DECIMAL(20, 8),
            allowNull: true,
        },
        tx_hash: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
    }, {timestamps: false, freezeTableName: true});
};