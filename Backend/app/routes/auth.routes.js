const controller = require("../controllers/ever_auth.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // app.post(
    //   "/api/auth/authChallenge",
    //   controller.auth_challenge
    // );

    // app.post(
    //   "/api/auth/auth_verify",
    //   controller.auth_verify
    // );

    app.post(
        "/api/auth/authChallengeEver",
        controller.auth_challenge_ever
    );

    app.post(
        "/api/auth/auth_verifyEver",
        controller.auth_verify_ever
    );

};
