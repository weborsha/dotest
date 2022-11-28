module.exports = (sequelize, Sequelize) => {
    const UserKeys = sequelize.define("user_keys", {
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
        // private_key: {
        //     type: Sequelize.STRING(255),
        //     allowNull: true,
        // },
        // public_key: {
        //     type: Sequelize.STRING(255),
        //     allowNull: true,
        // },
        seed: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    }, {timestamps: false});

    return UserKeys;
};