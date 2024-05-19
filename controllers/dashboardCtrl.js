const asyncHandler = require('express-async-handler')
const moment = require('moment-timezone');

const User = require('../models/userModel')
const Post = require('../models/postModel')

const dashboard = asyncHandler(async(req, res) => {
    const lastPosts = await Post.find({idUser: req.user._id}).limit(10)
    const countPosts = await Post.countDocuments({idUser: req.user._id})

    for (const post of lastPosts) {
        const dateCreatedAt = moment.utc(post.createdAt);
        const nowMinusThreeHours = dateCreatedAt.clone().subtract(3, 'hours');

        post.createdAtFormatted = nowMinusThreeHours.format("DD/MM/YYYY");
    }

    res.render('layouts/app/dashboard', {user: req.user, countPosts: countPosts, lastPosts: lastPosts.reverse()})
})

module.exports = 
{   
    dashboard
}