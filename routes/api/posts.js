const express = require('express');

const router = express.Router();


const User = require('../../schemas/UserSchema');




router.post("/", (req, res, next) => {
    if (!req.body.content)
        return res.sendStatus(400)

    res.status(200).send('it worked!')
})


module.exports = router;