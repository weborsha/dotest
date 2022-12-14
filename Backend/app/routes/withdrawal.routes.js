const controller = require("../controllers/withdrawal.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // app.post(
    //     "/api/user/withdrawal/check/eth",
    //     controller.withdrawalEthCheck
    // );

    app.post(
        "/api/user/withdrawal/check",
        controller.withdrawalCheck
    );

    // app.post(
    //     "/api/user/withdrawal/check/ever",
    //     controller.withdrawalEverCheck
    // );

};
