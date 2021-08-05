const express = require('express');

const router = express.Router();




// import routes
const posts = require('./posts');


// import middleware
const middleware = require('../../middleware')


router.use("/posts", posts)




module.exports = router;