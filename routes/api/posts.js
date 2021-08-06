const express = require('express');

const router = express.Router();


const userModel = require('../../schemas/UserSchema');
const postsModel = require('../../schemas/PostSchema');



router.get('/', async (req, res, next) => {
    const posts = await postsModel.find({}, {}, { sort: { createdAt: -1 }, populate: [{ path: 'postedBy', select: '-email -password' }] });
    res.json(posts);
})
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
router.put('/:id/like', async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.session.user._id;



        const isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

        var option = isLiked ? "$pull" : "$addToSet";

        // insert user like
        req.session.user = await userModel.findByIdAndUpdate(userId, { [option]: { likes: postId } }, { new: true })
            .catch(err => {
                console.log(err);
                res.status(500).send(err);
            })

        // insert post like
        const post = await postsModel.findByIdAndUpdate(postId, { [option]: { likes: userId } }, { new: true })
        res.status(200).send(post);

    } catch (error) {
        console.log(error)
        res.status(400)
    }
})

module.exports = router;