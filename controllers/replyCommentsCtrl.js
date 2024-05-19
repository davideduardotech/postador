const asyncHandler = require('express-async-handler')
const axios = require('axios')
const { format } = require('date-fns');

const Post = require('../models/postModel')
const User = require('../models/userModel')
const Plan = require('../models/planModel')
const Reply = require('../models/replyModel')

async function subscribePageWebhook(page) {
    const subscribeResponse = await axios.post(
        `https://graph.facebook.com/v12.0/${page.idPage}/subscribed_apps`,
        {
          subscribed_fields: 'feed',
          access_token: page.accessToken,
          callback_url: (process.env.MODE == "DEV") ? process.env.FACEBOOK_WEBHOOK_URL_DEV : process.env.FACEBOOK_WEBHOOK_URL_PROD
        }
    );

    return subscribeResponse
}

const replyComments = asyncHandler(async(req, res) => {
    const findPosts = await Post.find({idUser: req.user._id}).select("content typePost replyCommentsStatus")

    const findPlan = await Plan.findOne({title: req.user.plan})

    const countReplyPosts = await Post.countDocuments({idUser: req.user._id, replyCommentsStatus: true})
    
    for (const post of findPosts) {
        const findReply = await Reply.findOne({idPost: post._id})
        
        if (findReply) {
            post.answered = findReply.answered.length
        } else {
            post.answered = "disabled"
        }
    }

    res.render('layouts/app/reply-comments', {user: req.user, posts: findPosts.reverse(), quantityActive: countReplyPosts, plan: findPlan})
})

const activeReply = asyncHandler(async(req, res) => {
    try {
        const { posts, type, nameStandard } = req.body
        
        let quantityComments;
        let contents;

        if (!req.user.isAdmin) {
            const findPlan = await Plan.findOne({title: req.user.plan})
                
            const countReplyPosts = await Post.countDocuments({idUser: req.user._id, replyCommentsStatus: true})

            if ((countReplyPosts + posts.length) > findPlan.quantityReplyPosts) {
                return res.status(500).json({ error: "Limite de robôs ativos atingido" })
            }

            quantityComments = findPlan.quantityComments
        } else {
            quantityComments = 100000
        }

        if (type != "standard") {
            contents = req.body.contents

            if (contents.length == 0) return res.status(500).json({ error: "Nenhum conteúdo encontrado" })
        } else {
            const findStandard = req.user.standardAnswers.find(item => item.name == nameStandard)

            if (findStandard) {
                contents = findStandard.contents
            } else {
                return res.status(500).json({ error: "Nenhum conteúdo encontrado" })
            }
        }

        for (const post of posts) {
            const updatePost = await Post.findByIdAndUpdate(post, { replyCommentsStatus: true })

            for (const item of updatePost.results) {
                if (item.type == "page") {
                    const findPage = req.user.pages.find(page => page.idPage == item.idPage)

                    if (!findPage) continue

                    await subscribePageWebhook(findPage)
                } else if (item.type == "account-instagram") {
                    const findInstagramAccount = req.user.accountsIg.find(i => i.idAccount == item.idAccount);

                    if (!findInstagramAccount) continue

                    const findPage = req.user.pages.find(page => page.idPage == findInstagramAccount.idPage)

                    if (!findPage) continue

                    await subscribePageWebhook(findPage)
                }
            }

            const findComment = await Reply.findById(post)

            if (findComment) {
                const reactivateBot = await Reply.findByIdAndUpdate(post, {contents: contents, status: true, limit: quantityComments})
            } else {
                const activeReply = await Reply.create({idUser: req.user._id, idPost: post, contents: contents, limit: quantityComments})
            }
        }

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Erro temporário no servidor" })
    }
})

const disableReply = asyncHandler(async(req, res) => {
    try {
        const { posts } = req.body
        
        for (const post of posts) {
            const updatePost = await Post.findByIdAndUpdate(post, {replyCommentsStatus: false})
            const disableReply = await Reply.findOneAndUpdate({idPost: post}, {status: false, contents: []})
        }

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Erro temporário no servidor" })
    }
})

const createStandardAnswers = asyncHandler(async(req, res) => {
    try {
        const { name, contents } = req.body

        const findPlan = await Plan.findOne({title: req.user.plan})

        if (!req.user.isAdmin) {
            if (!findPlan.standardAnswers) return res.status(500).json({ error: "Seu plano não disponibiliza a criação de respostas padrões" })
        }

        if (name.length == 0) return res.status(500).json({ error: "Insira um nome para as respostas" })
        if (contents.length == 0) return res.status(500).json({ error: "Nenhum conteúdo encontrado" })
        
        const findStandard = req.user.standardAnswers.find(item => item.name == name)

        if (!findStandard) {
            const saveStandard = await User.findByIdAndUpdate(req.user._id, {
                $push: {
                    standardAnswers: {
                        name: name,
                        contents: contents
                    }
                }
            })

            res.sendStatus(200)
        } else {
            res.status(500).json({ error: "Nome já existente" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Erro temporário no servidor" })
    }
})

const deleteStandardAnswers = asyncHandler(async(req, res) => {
    try {
        const { name } = req.body
        
        const deleteStandard = await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                standardAnswers: {
                    name: name
                }
            }
        })

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Erro temporário no servidor" })
    }
})

module.exports = {
    replyComments,
    activeReply,
    disableReply,
    createStandardAnswers,
    deleteStandardAnswers
}