const User = require("../models/User");
const Post = require('../models/Post')
const { success, error } = require("../utils/responseWrapper");
const { mapPostOutput } = require("../utils/Utils");
const cloudinary = require('cloudinary').v2;



const createPostController = async (req, res) => {
    try {
        const { caption, postImg } = req.body;
        if (!caption || !postImg) {
            return res.send(error(400, "Caption and postImage are required"))
        }


        const cloudImg = await cloudinary.uploader.upload(postImg,
            {
                folder: 'postImage'
            }
        )


        const owner = req._id;

        const user = await User.findById(req._id);

        const post = await Post.create({
            owner,
            caption,
            image: {
                publicId: cloudImg.public_id,
                url: cloudImg.url
            },
        });


        user.posts.push(post._id);
        await user.save();



        // return res.json(success(201, { post }))
        return res.json(success(200, { post }))
        // return res.json({ user })

    } catch (e) {
        // console.log('this is my error')
        return res.send(error(500, e.message))

    }

}


const likeAndUnlikePost = async (req, res) => {

    try {
        const { postId } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId).populate('owner');
        if (!post) {
            return res.send(error(404, 'Post not found'));
        }

        if (post.likes.includes(curUserId)) {
            const index = post.likes.indexOf(curUserId);
            post.likes.splice(index, 1);

            // await post.save();
            // return res.send(success(200, 'post unliked'))
        }
        else {
            post.likes.push(curUserId)
            // await post.save();
            // return res.send(success(200, 'post liked'))
        }
        await post.save();
        return res.send(success(200, { post: mapPostOutput(post, req._id) }))


    } catch (e) {
        return res.send(error(500, e.message))

    }



}

const updatePostController = async (req, res) => {
    try {
        const { postId, caption } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.send(error(404, "Post not found"))
        }

        if (post.owner.toString() !== curUserId) {
            return res.send(error(403, "Only owners can update thier post"))
        }
        if (caption) {
            post.caption = caption;
        }

        await post.save();

        return res.send(success(200, { post }))

    } catch (e) {

        return res.send(error(500, e.message))
    }

}

const deletePost = async (req, res) => {
    try {

        const { postId } = req.body;
        const curUserId = req._id;


        const post = await Post.findById(postId);
        const curUser = await User.findById(curUserId);


        if (!post) {
            return res.send(error(404, "Post not found"))
        }

        if (post.owner.toString() !== curUserId) {
            return res.send(error(403, "Only owners can delete thier post"))
        }
        const index = curUser.posts.indexOf(postId)
        curUser.posts.splice(index, 1)
        await curUser.save();
        await post.remove();

        return res.send(success(200, 'post deleted successfully'));
    } catch (e) {
        return res.send(error(500, e.message));

    }
}

module.exports = {

    createPostController,
    likeAndUnlikePost,
    updatePostController,
    deletePost,
}