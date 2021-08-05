const express = require('express');

const router = express.Router();


const User = require('../../schemas/UserSchema');




router.post("/", (req, res, next) => {
    res.status(200).send('it worked!')
})


module.exports = router;