const mongoose = require('mongoose');
const moment = require('moment-timezone');
const axios = require('axios');
const videoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];
const path = require('path')
const mime = require('mime-types');
const fs = require('fs').promises
const fsSync = require('fs')

const Post = require('../models/postModel');
const User = require('../models/userModel')

mongoose.connect('mongodb://127.0.0.1:27017/pluBee', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
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

    async function findPosts() {
        const now = moment().tz('America/Sao_Paulo');

        const nowMinusThreeHours = now.clone().subtract(3, 'hours');

        const posts = await Post.find({
            isPublished: false,
            isSchedule: true,
            scheduleDate: { $lte: nowMinusThreeHours.format('YYYY-MM-DDTHH:mm:ss.SSSZ') },
        });

        const result = [];

        for (const post of posts) {
            if (post.isPublished === false) {
                post.isPublished = true;

                await post.save();

                const findUser = await User.findById(post.idUser)

                if (findUser) {
                    result.push({ post, user: findUser });
                }
            }
        }

        return result;
    }

    async function getImageUrlPost(post, user) {
        const findPost = await Post.findById(post._id)

        if (findPost.results.length > 0) {
            const findResult = findPost.results.find(item => item.status == "published")

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
                        const updateImagePost = await Post.findByIdAndUpdate(findPost._id, { media: response.data.full_picture })
                    } else if (response.data.media_url != undefined) {
                        const updateImagePost = await Post.findByIdAndUpdate(findPost._id, { media: response.data.media_url })
                    }
                })
                .catch(error => {
                    console.error('Erro ao obter a imagem:', error.response.data);
                });
        }
    }

    setInterval(async () => {
        try {
            const dataPosts = await findPosts()

            if (dataPosts.length > 0) {
                await Promise.all(dataPosts.map(async (dataPost, index) => {
                    const post = dataPost.post;
                    const user = dataPost.user;

                    const timeInterval = post.interval * 1000;

                    const addDelay = async (index, length) => {
                        if (index < length - 1) {
                            await delay(timeInterval);
                        }
                    };

                    if (dataPost.post.typePost == "text-link") {
                        const formData = new FormData();
                        formData.append("link", post.link);
                        formData.append('message', post.content);

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

                                            const saveResult = await Post.findByIdAndUpdate(post._id, {
                                                $push: {
                                                    results: {
                                                        id: `${response.data.id}`, idPage: findPage.idPage, name: findPage.name, photo: findPage.photo, status: "published", type: "page", hour: getCurrentTime()
                                                    }
                                                }
                                            })
                                        } catch (error) {
                                            const code = error.response.data.error.code

                                            const saveResult = await Post.findByIdAndUpdate(post._id, {
                                                $push: {
                                                    results: {
                                                        id: "", idPage: findPage.idPage, name: findPage.name, photo: findPage.photo, status: "error", type: "page", hour: getCurrentTime(), message: checkErrorCodeFb(code)
                                                    }
                                                }
                                            })
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

                                                const saveResult = await Post.findByIdAndUpdate(post._id, {
                                                    $push: {
                                                        results: {
                                                            id: `${response.data.id}`, idGroup: findGroup.idGroup, name: findGroup.name, photo: findGroup.photo, status: "published", type: "group", hour: getCurrentTime()
                                                        }
                                                    }
                                                })
                                            } catch (error) {
                                                const code = error.response.data.error.code

                                                const saveResult = await Post.findByIdAndUpdate(post._id, {
                                                    $push: {
                                                        results: {
                                                            id: "", idGroup: findGroup.idGroup, name: findGroup.name, photo: findGroup.photo, status: "error", type: "group", hour: getCurrentTime(), message: checkErrorCodeFb(code)
                                                        }
                                                    }
                                                })
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
                    } else if (dataPost.post.typePost == "media") {
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
                                                const saveResult = await Post.findByIdAndUpdate(post._id, {
                                                    $push: {
                                                        results: {
                                                            id: `${response.data.post_id}`, idPage: findPage.idPage, name: findPage.name, photo: findPage.photo, status: "published", type: "page", hour: getCurrentTime()
                                                        }
                                                    }
                                                })
                                            } else {
                                                const saveResult = await Post.findByIdAndUpdate(post._id, {
                                                    $push: {
                                                        results: {
                                                            id: `${response.data.id}`, idPage: findPage.idPage, name: findPage.name, photo: findPage.photo, status: "published", type: "page", hour: getCurrentTime()
                                                        }
                                                    }
                                                })
                                            }
                                        } catch (error) {
                                            const code = error.response.data.error.code

                                            const saveResult = await Post.findByIdAndUpdate(post._id, {
                                                $push: {
                                                    results: {
                                                        id: "", idPage: findPage.idPage, name: findPage.name, photo: findPage.photo, status: "error", type: "page", hour: getCurrentTime(), message: checkErrorCodeFb(code)
                                                    }
                                                }
                                            })
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
                                                    const saveResult = await Post.findByIdAndUpdate(post._id, {
                                                        $push: {
                                                            results: {
                                                                id: `${response.data.post_id}`, idGroup: findGroup.idGroup, name: findGroup.name, photo: findGroup.photo, status: "published", type: "group", hour: getCurrentTime()
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    const saveResult = await Post.findByIdAndUpdate(post._id, {
                                                        $push: {
                                                            results: {
                                                                id: `${response.data.id}`, idGroup: findGroup.idGroup, name: findGroup.name, photo: findGroup.photo, status: "published", type: "group", hour: getCurrentTime()
                                                            }
                                                        }
                                                    })
                                                }
                                            } catch (error) {
                                                const code = error.response.data.error.code

                                                const saveResult = await Post.findByIdAndUpdate(post._id, {
                                                    $push: {
                                                        results: {
                                                            id: "", idGroup: findGroup.idGroup, name: findGroup.name, photo: findGroup.photo, status: "error", type: "group", hour: getCurrentTime(), message: checkErrorCodeFb(code)
                                                        }
                                                    }
                                                })
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
                                                    const saveResult = await Post.findByIdAndUpdate(post._id, {
                                                        $push: {
                                                            results: {
                                                                id: `${sendContainer.data.id}`, idAccount: findAccount.idAccount, name: findAccount.name, username: findAccount.username, photo: findAccount.photo, status: "published", type: "account-instagram", hour: getCurrentTime()
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    const saveResult = await Post.findByIdAndUpdate(post._id, {
                                                        $push: {
                                                            results: {
                                                                id: "", idAccount: findAccount.idAccount, name: findAccount.name, username: findAccount.username, photo: findAccount.photo, status: "error", type: "account-instagram", hour: getCurrentTime()
                                                            }
                                                        }
                                                    })
                                                }
                                            } else {
                                                continue
                                            }
                                        } catch (error) {
                                            const code = error.response.data.error.code

                                            const saveResult = await Post.findByIdAndUpdate(post._id, {
                                                $push: {
                                                    results: {
                                                        id: "", idAccount: findAccount.idAccount, name: findAccount.name, username: findAccount.username, photo: findAccount.photo, status: "error", type: "account-instagram", hour: getCurrentTime(), message: checkErrorCodeIg(code)
                                                    }
                                                }
                                            })
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

                        await getImageUrlPost(post, user)
                    }
                }));
            }
        } catch (err) {
            console.log(err)
        }
    }, 10000);
});