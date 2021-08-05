const express = require('express');

const router = express.Router();


const userModel = require('../../schemas/UserSchema');
const postsModel = require('../../schemas/PostSchema');




router.post("/", async (req, res, next) => {
    if (!req.body.content)
        return res.sendStatus(400)


    const postData = {
        content: req.body.content,
        postedBy: req.session.user
    }
    try {
        let newPost = await postsModel.create(postData)
        newPost = await userModel.populate(newPost, { path: 'postedBy', select: '-password -email' })
        res.status(201).send(newPost)
    } catch (error) {
        console.log(error)
        res.status(400)
    }


})


module.exports = router;