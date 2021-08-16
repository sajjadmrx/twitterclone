const express = require('express');

const router = express.Router();

const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

// import routes
const loginRoute = require('./login');
const registerRoute = require('./register');

// import middleware
const middleware = require('../middleware')


router.get("/:id", middleware.requireLogin, (req, res, next) => {
    delete req.session.user.password;

    var payload = {
        pageTitle: "View post",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id,
    }

    res.status(200).render("postPage", payload);
})



module.exports = router;