const express = require('express');

const router = express.Router();

const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

// import routes
const loginRoute = require('./login');
const registerRoute = require('./register');
const postRoutes = require('./postRoutes');

// import middleware
const middleware = require('../middleware')


router.get("/", middleware.requireLogin, (req, res, next) => {
    delete req.session.user.password;

    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    }

    res.status(200).render("home", payload);
})
router.use('/post', postRoutes)
router.use('/login', loginRoute);
router.use('/register', registerRoute);


module.exports = router;