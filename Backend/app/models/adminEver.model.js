module.exports = (sequelize, Sequelize) => {
    const AdminEver = sequelize.define("admin_ever", {
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
        seed: {
            type: Sequelize.STRING(255),
            allowNull: true,
        }
    }, {timestamps: false, freezeTableName: true});

    return AdminEver;
};