const {authJwt} = require("../middleware");
const controller = require("../controllers/user_wallets.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/api/user/wallets",
        [authJwt.verifyToken],
        controller.userWallet
    );

};
