module.exports = (sequelize, Sequelize) => {
    const AdminBtc = sequelize.define("admin_btc", {
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

    return AdminBtc;
};