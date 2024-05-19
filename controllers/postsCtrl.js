const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')
const Post = require('../models/postModel')
const Plan = require('../models/planModel')

const axios = require('axios')
const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
const path = require('path')
const mime = require('mime-types');
const moment = require('moment-timezone');
const fs = require('fs').promises
const fsSync = require('fs')


// All posts

const allPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find({ idUser: req.user._id })

    for (const post of posts) {
        const dateCreatedAt = moment.utc(post.createdAt);
        const nowMinusThreeHours = dateCreatedAt.clone().subtract(3, 'hours');

        post.createdAtFormatted = nowMinusThreeHours.format("DD/MM/YYYY");

        if (post.isSchedule) {
            const scheduleDate = moment.utc(post.scheduleDate);

            post.scheduleDateFormatted = scheduleDate.format("DD/MM/YYYY HH:mm");
        }
    }

    res.render('layouts/app/all-posts', { user: req.user, posts: posts.reverse() })
})

const viewPostPage = asyncHandler(async (req, res) => {
    const findPost = await Post.findById(req.params.id)

    if (findPost.idUser.toString() != req.user._id.toString()) return res.render("layouts/not-found")

    const dateCreatedAt = moment.utc(findPost.createdAt);
    const nowMinusThreeHours = dateCreatedAt.clone().subtract(3, 'hours');

    findPost.createdAtFormatted = nowMinusThreeHours.format("DD/MM/YYYY");

    if (findPost.isSchedule) {
        const scheduleDate = moment.utc(findPost.scheduleDate);

        findPost.scheduleDateFormatted = scheduleDate.format("DD/MM/YYYY HH:mm");
    }

    for (const result of findPost.results) {
        if (result.type == "page") {
            const findPage = req.user.pages.find(item => item.idPage == result.idPage)

            if (findPage) {
                const findAccount = req.user.accountsFb.find(item => item.idAccount == findPage.idAccount)

                if (findAccount) {
                    result.nameAccount = findAccount.name
                    result.idAccount = findAccount.idAccount
                } else {
                    result.nameAccount = "Não encontrada"
                    result.idAccount = ""
                }
            } else {
                result.nameAccount = "Não encontrada"
                result.idAccount = ""
            }
        } else if (result.type == "group") {
            const findGroup = req.user.groups.find(item => item.idGroup == result.idGroup)

            if (findGroup) {
                const findAccount = req.user.accountsFb.find(item => item.idAccount == findGroup.idAccount)

                if (findAccount) {
                    result.nameAccount = findAccount.name
                    result.idAccount = findAccount.idAccount
                } else {
                    result.nameAccount = "Não encontrada"
                    result.idAccount = ""
                }
            } else {
                result.nameAccount = "Não encontrada"
                result.idAccount = ""
            }
        } else if (result.type == "account-instagram") {
            const findAccount = req.user.accountsIg.find(item => item.idAccount == result.idAccount)

            if (findAccount) {
                result.nameAccount = findAccount.name
                result.usernameAccount = findAccount.username
            } else {
                result.nameAccount = "Não encontrada"
                result.usernameAccount = ""
            }
        }
    }

    res.render("layouts/app/view-post", { user: req.user, post: findPost })
})


// Create post

const createPostPage = asyncHandler(async (req, res) => {
    let groupsSets = []
    let pagesSets = []

    let groupsAll = []
    let pagesAll = []

    for (const set of req.user.groupsSets) {
        set.groups.forEach(group => {
            const findGroup = req.user.groups.find(item => item.idGroup == group.idGroup)

            if (findGroup) {
                group.name = findGroup.name,
                    group.photo = findGroup.photo
            } else {
                const removeGroupIndex = set.groups.findIndex(item => item.idGroup === group.idGroup);

                if (removeGroupIndex !== -1) {
                    set.groups.splice(removeGroupIndex, 1);
                }
            }
        })

        groupsSets.push(set)
    }

    for (const set of req.user.pagesSets) {
        set.pages.forEach(page => {
            const findPage = req.user.pages.find(item => item.idPage == page.idPage)

            if (findPage) {
                page.name = findPage.name,
                    page.photo = findPage.photo
            } else {
                const removePageIndex = set.pages.findIndex(item => item.idPage === page.idPage);

                if (removePageIndex !== -1) {
                    set.pages.splice(removePageIndex, 1);
                }
            }
        })

        pagesSets.push(set)
    }

    for (const group of req.user.groups) {
        groupsAll.push({ idGroup: group.idGroup, idAccount: group.idAccount, photo: group.photo })
    }

    for (const page of req.user.pages) {
        pagesAll.push({ idPage: page.idPage, idAccount: page.idAccount, photo: page.photo })
    }

    const findPlan = await Plan.findOne({ title: req.user.plan })

    res.render("layouts/app/create-post", { user: req.user, groupsSets: groupsSets, groupsAll: groupsAll, pagesSets: pagesSets, pagesAll: pagesAll, plan: findPlan })
})

function readFileAsync(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path)
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function checkErrorCodeFb(code) {
    const filePath = fsSync.readFileSync(path.resolve(__dirname, '..', 'json', 'error-messages-facebook.json'), 'utf8');
    const errorMessages = JSON.parse(filePath);

    const findCode = errorMessages.find(item => item.code == code)

    if (findCode) {
        return findCode.message
    } else {
        return "Erro desconhecido"
    }
}

function checkErrorCodeIg(code) {
    const filePath = fsSync.readFileSync(path.resolve(__dirname, '..', 'json', 'error-messages-instagram.json'), 'utf8');
    const errorMessages = JSON.parse(filePath);

    const findCode = errorMessages.find(item => item.code == code)

    if (findCode) {
        return findCode.message
    } else {
        return "Erro desconhecido"
    }
}

function getCurrentTime() {
    const currentDate = new Date();

    const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return dateTimeFormat.format(currentDate)
}

async function getImageUrlPost(post, user) {
    if (post.results.length > 0) {
        const findResult = post.results.find(item => item.status == "published")

        if (!findResult) return

        let postUrl;

        if (findResult.type == "page") {
            const findPage = user.pages.find(item => item.idPage == findResult.idPage)

            postUrl = `https://graph.facebook.com/v16.0/${findResult.id}?fields=full_picture&access_token=${findPage.accessToken}`
        } else if (findResult.type == "group") {
            const findGroup = user.groups.find(item => item.idGroup == findResult.idGroup)
            const findAccount = user.accountsFb.find(account => account.idAccount == findGroup.idAccount)

            postUrl = `https://graph.facebook.com/v16.0/${findResult.id}?fields=full_picture&access_token=${findAccount.accessToken}`
        } else if (findResult.type == "account-instagram") {
            const findAccount = user.accountsIg.find(item => item.idAccount == findResult.idAccount)

            const findPage = user.pages.find(page => page.idPage == findAccount.idPage)

            postUrl = `https://graph.facebook.com/v16.0/${findResult.id}?fields=media_url&access_token=${findPage.accessToken}`
        }

        axios.get(postUrl)
            .then(async response => {
                if (response.data.full_picture != undefined) {
                    const updateImagePost = await Post.findByIdAndUpdate(post._id, { media: response.data.full_picture })
                } else if (response.data.media_url != undefined) {
                    const updateImagePost = await Post.findByIdAndUpdate(post._id, { media: response.data.media_url })
                }
            })
            .catch(error => {
                console.error('Erro ao obter a imagem:', error.response.data);
            });
    }
}

async function createPostMedia(post, user) {
    try {
        const results = []
        const timeInterval = post.interval * 1000;

        const addDelay = async (index, length) => {
            if (index < length - 1) {
                await delay(timeInterval);
            }
        };

        const mediaPath = path.join(__dirname, '..', 'public', 'img', 'posts', post.media)
        const data = await readFileAsync(mediaPath);

        if (post.pages.length > 0) {
            const ids = []

            for (let i = 0; i < post.pages.length; i++) {
                const page = post.pages[i];

                if (!ids.includes(page.idPage)) {
                    ids.push(page.idPage)

                    const findPage = user.pages.find(item => item.idPage == page.idPage)

                    if (findPage) {
                        let endpoint;

                        const formData = new FormData();

                        const fileType = mime.lookup(mediaPath);

                        if (!videoTypes.includes(fileType)) {
                            endpoint = "photos"

                            const photoData = new Blob([data], { type: "image/png" });
                            formData.append("source", photoData);

                            formData.append('access_token', findPage.accessToken);
                            formData.append('message', post.content);
                        } else {
                            endpoint = "videos"

                            const videoData = new Blob([data], { type: "video/mp4" });

                            formData.append("access_token", findPage.accessToken);
                            formData.append("source", videoData, "video.mp4");
                            formData.append("title", post.content);
                            formData.append("description", post.content);
                        }

                        try {
                            const response = await axios({
                                method: 'POST',
                                url: `https://graph.facebook.com/v18.0/${page.idPage}/${endpoint}`,
                                data: formData,
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            });

                            if (response.data.post_id) {
                                results.push({ id: `${response.data.post_id}`, idPage: findPage.idPage, name: findPage.name, photo: findPage.photo, status: "published", type: "page", hour: getCurrentTime() })
                            } else {
                                results.push({ id: `${response.data.id}`, idPage: findPage.idPage, name: findPage.name, photo: findPage.photo, status: "published", type: "page", hour: getCurrentTime() })
                            }
                        } catch (error) {
                            const code = error.response.data.error.code

                            results.push({ id: "", idPage: findPage.idPage, name: findPage.name, photo: findPage.photo, status: "error", type: "page", hour: getCurrentTime(), message: checkErrorCodeFb(code) })
                        }

                        await addDelay(i, post.pages.length);
                    } else {
                        continue
                    }
                } else {
                    continue
                }
            }
        }

        if (post.groups.length > 0) {
            const ids = []

            for (let i = 0; i < post.groups.length; i++) {
                const group = post.groups[i];

                if (!ids.includes(group.idGroup)) {
                    ids.push(group.idGroup)

                    const findGroup = user.groups.find(item => item.idGroup == group.idGroup)

                    if (findGroup) {
                        const findAccount = user.accountsFb.find(account => account.idAccount == group.idAccount)

                        if (findAccount) {
                            let endpoint;

                            const formData = new FormData();

                            const fileType = mime.lookup(mediaPath);

                            if (!videoTypes.includes(fileType)) {
                                endpoint = "photos"

                                const photoData = new Blob([data], { type: "image/png" });
                                formData.append("source", photoData);

                                formData.append('access_token', findAccount.accessToken);
                                formData.append('message', post.content);
                            } else {
                                endpoint = "videos"

                                const videoData = new Blob([data], { type: "video/mp4" });

                                formData.append("access_token", findAccount.accessToken);
                                formData.append("source", videoData, "video.mp4");
                                formData.append("title", post.content);
                                formData.append("description", post.content);
                            }

                            try {
                                const response = await axios({
                                    method: 'POST',
                                    url: `https://graph.facebook.com/v18.0/${group.idGroup}/${endpoint}`,
                                    data: formData,
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                });

                                if (response.data.post_id) {
                                    results.push({ id: `${response.data.post_id}`, idGroup: findGroup.idGroup, name: findGroup.name, photo: findGroup.photo, status: "published", type: "group", hour: getCurrentTime() })
                                } else {
                                    results.push({ id: `${response.data.id}`, idGroup: findGroup.idGroup, name: findGroup.name, photo: findGroup.photo, status: "published", type: "group", hour: getCurrentTime() })
                                }
                            } catch (error) {
                                const code = error.response.data.error.code

                                results.push({ id: "", idGroup: findGroup.idGroup, name: findGroup.name, photo: findGroup.photo, status: "error", type: "group", hour: getCurrentTime(), message: checkErrorCodeFb(code) })
                            }

                            await addDelay(i, post.groups.length);
                        } else {
                            continue
                        }
                    } else {
                        continue
                    }
                } else {
                    continue
                }
            }
        }

        if (post.accountsInstagram.length > 0) {
            const ids = []

            for (let i = 0; i < post.accountsInstagram.length; i++) {
                const account = post.accountsInstagram[i];

                if (!ids.includes(account.idAccount)) {
                    ids.push(account.idAccount)

                    const findAccount = user.accountsIg.find(item => item.idAccount == account.idAccount)

                    if (findAccount) {
                        const findPage = user.pages.find(page => page.idPage == findAccount.idPage)

                        const formDataCreateContainer = new FormData();

                        const fileType = mime.lookup(mediaPath);

                        if (videoTypes.includes(fileType)) {
                            formDataCreateContainer.append('media_type', 'REELS');
                            formDataCreateContainer.append('share_to_feed', true)
                            formDataCreateContainer.append('video_url', `https://plubee.net/img/posts/${post.media}`);
                        } else {
                            formDataCreateContainer.append('image_url', `https://plubee.net/img/posts/${post.media}`);
                        }

                        formDataCreateContainer.append('access_token', findPage.accessToken);
                        formDataCreateContainer.append('caption', post.content);

                        try {
                            const createContainer = await axios({
                                method: 'POST',
                                url: `https://graph.facebook.com/v18.0/${findAccount.idAccount}/media`,
                                data: formDataCreateContainer,
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            });

                            if (createContainer.data.id != null) {
                                const formDataSendContainer = new FormData();
                                formDataSendContainer.append('creation_id', createContainer.data.id);
                                formDataSendContainer.append('access_token', findPage.accessToken);

                                const sendContainer = await axios({
                                    method: 'POST',
                                    url: `https://graph.facebook.com/v18.0/${findAccount.idAccount}/media_publish`,
                                    data: formDataSendContainer,
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                });

                                if (sendContainer.data.id) {
                                    results.push({ id: `${sendContainer.data.id}`, idAccount: findAccount.idAccount, name: findAccount.name, username: findAccount.username, photo: findAccount.photo, status: "published", type: "account-instagram", hour: getCurrentTime() })
                                } else {
                                    results.push({ id: "", idAccount: findAccount.idAccount, name: findAccount.name, username: findAccount.username, photo: findAccount.photo, status: "error", type: "account-instagram", hour: getCurrentTime() })
                                }
                            } else {
                                continue
                            }
                        } catch (error) {
                            const code = error.response.data.error.code

                            results.push({ id: "", idAccount: findAccount.idAccount, name: findAccount.name, username: findAccount.username, photo: findAccount.photo, status: "error", type: "account-instagram", hour: getCurrentTime(), message: checkErrorCodeIg(code) })
                        }

                        await addDelay(i, post.groups.length);
                    } else {
                        continue
                    }
                } else {
                    continue
                }
            }
        }

        await fsSync.unlinkSync(mediaPath)

        return results
    } catch (err) {
        console.log(err)
        return false
    }
}

async function createPostLink(post, user) {
    try {
        const formData = new FormData();
        formData.append("link", post.link);
        formData.append('message', post.content);

        const results = [];
        const timeInterval = post.interval * 1000;

        const addDelay = async (index, length) => {
            if (index < length - 1) {
                await delay(timeInterval);
            }
        };

        if (post.pages.length > 0) {
            const ids = [];

            for (let i = 0; i < post.pages.length; i++) {
                const page = post.pages[i];

                if (!ids.includes(page.idPage)) {
                    ids.push(page.idPage);

                    const findPage = user.pages.find(item => item.idPage == page.idPage);

                    if (findPage) {
                        formData.append('access_token', findPage.accessToken);

                        try {
                            const response = await axios({
                                method: 'POST',
                                url: `https://graph.facebook.com/v18.0/${page.idPage}/feed`,
                                data: formData,
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            });

                            results.push({ id: `${response.data.id}`, idPage: findPage.idPage, name: findPage.name, photo: findPage.photo, status: "published", type: "page", hour: getCurrentTime() });
                        } catch (error) {
                            const code = error.response.data.error.code

                            results.push({ id: "", idPage: findPage.idPage, name: findPage.name, photo: findPage.photo, status: "error", type: "page", hour: getCurrentTime(), message: checkErrorCodeFb(code) });
                        }

                        await addDelay(i, post.pages.length);
                    } else {
                        continue;
                    }
                } else {
                    continue;
                }
            }
        }

        if (post.groups.length > 0) {
            const ids = [];

            for (let i = 0; i < post.groups.length; i++) {
                const group = post.groups[i];

                if (!ids.includes(group.idGroup)) {
                    ids.push(group.idGroup);

                    const findGroup = user.groups.find(item => item.idGroup == group.idGroup);

                    if (findGroup) {
                        const findAccount = user.accountsFb.find(account => account.idAccount == group.idAccount);

                        if (findAccount) {
                            formData.append('access_token', findAccount.accessToken);

                            try {
                                const response = await axios({
                                    method: 'POST',
                                    url: `https://graph.facebook.com/v18.0/${group.idGroup}/feed`,
                                    data: formData,
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                });

                                results.push({ id: `${response.data.id}`, idGroup: findGroup.idGroup, name: findGroup.name, photo: findGroup.photo, status: "published", type: "group", hour: getCurrentTime() });
                            } catch (error) {
                                const code = error.response.data.error.code

                                results.push({ id: "", idGroup: findGroup.idGroup, name: findGroup.name, photo: findGroup.photo, status: "error", type: "group", hour: getCurrentTime(), message: checkErrorCodeFb(code) });
                            }

                            await addDelay(i, post.groups.length);
                        } else {
                            continue;
                        }
                    } else {
                        continue
                    }
                } else {
                    continue;
                }
            }
        }

        return results;
    } catch (err) {
        console.log(err);
        return false;
    }
}

const savePost = asyncHandler(async (req, res) => {
    try {
        const { content, pages, groups, accountsInstagram, schedule, day, hour, interval, media, link, type } = req.body

        if (schedule) {
            if (!req.user.isAdmin) {
                const findPlan = await Plan.findOne({ title: req.user.plan })

                const countSchedulePosts = await Post.countDocuments({ idUser: req.user._id, isSchedule: true })

                if (countSchedulePosts == findPlan.quantitySchedule) {
                    return res.status(500).json({ error: "Limite de publicações pendentes atingido" })
                }
            }

            const date = moment.tz(`${day} ${hour}`, 'YYYY-MM-DD HH:mm', 'UTC');

            const savePost = await Post.create({
                idUser: req.user._id,
                content: content,
                link: link,
                media: media,
                statusBot: false,
                pages: pages,
                groups: groups,
                accountsInstagram: (type == "media") ? accountsInstagram : [],
                typePost: type,
                interval: (parseInt(interval)) ? interval : 0,
                scheduleDate: date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                isSchedule: true,
                isPublished: false
            })

            if (savePost) {
                res.sendStatus(200)
            } else {
                res.status(500).json({ error: "Não foi possível salvar a publicação" })
            }
        } else {
            const createPost = (type == "text-link") ? await createPostLink(req.body, req.user) : await createPostMedia(req.body, req.user)

            const savePost = await Post.create({
                idUser: req.user._id,
                content: content,
                link: link,
                media: media,
                statusBot: false,
                pages: pages,
                groups: groups,
                accountsInstagram: (type == "media") ? accountsInstagram : [],
                typePost: type,
                results: createPost,
                interval: (parseInt(interval)) ? interval : 0,
                isSchedule: false,
                isPublished: true
            })

            if (savePost) {
                const getImage = await getImageUrlPost(savePost, req.user)

                res.sendStatus(200)
            } else {
                res.status(500).json({ error: "Não foi possível salvar a publicação" })
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Erro temporário no servidor" })
    }
})


// Update post

const updatePostPage = asyncHandler(async (req, res) => {
    const findPost = await Post.findById(req.params.id)

    if (findPost.idUser.toString() != req.user._id.toString()) return res.render("layouts/not-found")

    let groupsSets = []
    let pagesSets = []

    let groupsAll = []
    let pagesAll = []

    for (const set of req.user.groupsSets) {
        set.groups.forEach(group => {
            const findGroup = req.user.groups.find(item => item.idGroup == group.idGroup)

            if (findGroup) {
                group.name = findGroup.name,
                    group.photo = findGroup.photo
            }
        })

        groupsSets.push(set)
    }

    for (const set of req.user.pagesSets) {
        set.pages.forEach(page => {
            const findPage = req.user.pages.find(item => item.idPage == page.idPage)

            if (findPage) {
                page.name = findPage.name,
                    page.photo = findPage.photo
            }
        })

        pagesSets.push(set)
    }

    for (const group of req.user.groups) {
        groupsAll.push({ idGroup: group.idGroup, idAccount: group.idAccount, photo: group.photo })
    }

    for (const page of req.user.pages) {
        pagesAll.push({ idPage: page.idPage, idAccount: page.idAccount, photo: page.photo })
    }

    const findPlan = await Plan.findOne({ title: req.user.plan })

    res.render("layouts/app/update-post", { user: req.user, post: findPost, groupsSets: groupsSets, groupsAll: groupsAll, pagesSets: pagesSets, pagesAll: pagesAll, plan: findPlan })
})

const updatePostScheduleMedia = asyncHandler(async (req, res) => {
    try {
        const { content, pages, accountsInstagram, groups, day, hour, interval } = req.body

        const findPost = await Post.findById(req.params.id)

        if (findPost.idUser.toString() != req.user._id.toString()) return res.status(500).json({ error: "Você não possui permissão para isso." })

        const date = moment.tz(`${day} ${hour}`, 'YYYY-MM-DD HH:mm', 'UTC');

        const updatePost = await Post.findByIdAndUpdate(req.params.id, {
            content: content,
            pages: pages,
            groups: groups,
            typePost: "media",
            interval: (isNaN(interval)) ? interval : 0,
            accountsInstagram: accountsInstagram,
            scheduleDate: date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        })

        if (updatePost) {
            res.sendStatus(200)
        } else {
            res.status(500).json({ error: "Não foi possível atualizar a publicação" })
        }
    } catch (err) {
        res.status(500).json({ error: "Erro temporário no servidor" })
    }
})

const updatePostScheduleLink = asyncHandler(async (req, res) => {
    try {
        const { content, pages, groups, day, hour, link, interval } = req.body

        const findPost = await Post.findById(req.params.id)

        if (findPost.idUser.toString() != req.user._id.toString()) return res.status(500).json({ error: "Você não possui permissão para isso." })

        const date = moment.tz(`${day} ${hour}`, 'YYYY-MM-DD HH:mm', 'UTC');

        const updatePost = await Post.findByIdAndUpdate(req.params.id, {
            content: content,
            link: link,
            pages: pages,
            groups: groups,
            typePost: "text-link",
            interval: interval,
            scheduleDate: date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        })

        if (updatePost) {
            res.sendStatus(200)
        } else {
            res.status(500).json({ error: "Não foi possível atualizar a publicação" })
        }
    } catch (err) {
        res.status(500).json({ error: "Erro temporário no servidor" })
    }
})

const updatePostPublished = asyncHandler(async (req, res) => {
    try {
        const findPost = await Post.findById(req.params.id)

        if (findPost.idUser.toString() != req.user._id.toString()) return res.status(500).json({ error: "Você não possui permissão para isso." })

        for (const item of findPost.results) {
            if (item.status == "published") {
                let accessToken;

                if (item.type == "page") {
                    const findPage = req.user.pages.find(page => page.idPage == item.idPage)

                    accessToken = (findPage) ? findPage.accessToken : ""

                    try {
                        const response = await axios.post(`https://graph.facebook.com/v14.0/${item.id}?message=${req.body.content}&access_token=${accessToken}`);
                    } catch (err) {
                        continue
                    }
                }
            }
        }

        const updatePost = await Post.findByIdAndUpdate(req.params.id, {
            "content": req.body.content,
        })

        if (updatePost) {
            res.sendStatus(200)
        } else {
            res.status(500).json({ error: "Não foi possível atualizar a publicação" })
        }
    } catch (err) {
        res.status(500).json({ error: "Erro temporário no servidor" })
    }
})


// Delete post

const deletePost = asyncHandler(async (req, res) => {
    try {
        const findPost = await Post.findById(req.params.id)

        if (findPost.idUser.toString() != req.user._id.toString()) return res.status(500).json({ error: "Você não possui permissão para isso." })

        for (const item of findPost.results) {
            if (item.status == "published") {
                let accessToken;

                if (item.type == "page") {
                    const findPage = req.user.pages.find(page => page.idPage == item.idPage)

                    accessToken = (findPage) ? findPage.accessToken : ""

                    try {
                        const response = await axios.delete(`https://graph.facebook.com/v14.0/${item.id}?access_token=${accessToken}`);
                    } catch (err) {
                        continue
                    }
                }
            }
        }

        const deletePost = await Post.findByIdAndDelete(req.params.id)

        if (deletePost) {
            res.sendStatus(200)
        } else {
            res.status(500).json({ error: "Não foi possível excluir a publicação" })
        }
    } catch (err) {
        res.status(500).json({ error: "Erro temporário no servidor" })
    }
});

module.exports = {
    allPosts,
    viewPostPage,

    createPostPage,
    savePost,

    updatePostPage,
    updatePostScheduleLink,
    updatePostScheduleMedia,
    updatePostPublished,

    deletePost
}