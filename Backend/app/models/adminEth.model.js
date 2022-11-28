module.exports = (sequelize, Sequelize) => {
    const AdminEth = sequelize.define("admin_eth", {
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
        private: {
            type: Sequelize.STRING(255),
            allowNull: true,
        }
    }, {timestamps: false, freezeTableName: true});

    return AdminEth;
};