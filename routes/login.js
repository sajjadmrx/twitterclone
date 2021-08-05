const express = require('express');

const router = express.Router();

const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');



router.get("/", (req, res, next) => {

    res.status(200).render("login");
})

router.post("/", async (req, res, next) => {

    var payload = req.body;

    if (req.body.logUsername && req.body.logPassword) {
        var user = await User.findOne({
            $or: [
                { username: req.body.logUsername },
                { email: req.body.logUsername }
            ]
        })
            .catch((error) => {
                console.log(error);
                payload.errorMessage = "Something went wrong.";
                res.status(200).render("login", payload);
            });

        if (!user) {
            payload.errorMessage = "Login credentials incorrect.";
            return res.status(200).render("login", payload);
        }


        var result = await bcrypt.compare(req.body.logPassword, user.password);
        if (result === true) {
            req.session.user = user;
            return res.redirect("/");
        } else {
            payload.errorMessage = "Login credentials incorrect.";
            return res.status(200).render("login", payload);

        }

    }

    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).render("login");
})

module.exports = router;