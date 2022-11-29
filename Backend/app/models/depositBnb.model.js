module.exports = (sequelize, Sequelize) => {
    const DepositBnb = sequelize.define("deposit_history_bnb", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        deposit_address: {
            type: Sequelize.STRING(70),
            allowNull: true,
        },
        amount: {
            type: Sequelize.DECIMAL(12, 8),
            allowNull: true,
        },
        token_rate: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
        }
    }, {timestamps: false, freezeTableName: true});

    return DepositBnb;
};