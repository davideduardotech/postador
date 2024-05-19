const asyncHandler = require('express-async-handler')
const axios = require('axios')

const User = require('../models/userModel')
const Plan = require('../models/planModel')

const socialAccounts = asyncHandler(async(req, res) => {
    const findPlan = await Plan.findOne({title: req.user.plan})
    res.render('layouts/app/social-accounts', {user: req.user, plan: findPlan})
})

async function newAccountFb(user, accessToken, profile) {
    try {
        const findPlan = await Plan.findOne({title: user.plan})

        if (!user.isAdmin) {
            if (findPlan.quantityAccounts == (user.accountsFb.length + user.accountsIg.length)) return
        }

        const date = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dateFormat = formater.format(date);

        const accounts = []

        user.accountsFb.forEach((account) => {
            accounts.push(account.idAccount)
        })
        
        if (accounts.includes(profile.id)) {
            return "Conta já existente"
        } else {
            User.findByIdAndUpdate(user._id, {
                $push: {
                    accountsFb: {
                        idAccount: profile.id,
                        name: `${profile.name.givenName} ${profile.name.familyName}` ,
                        platform: "Facebook",
                        photo: profile.photos[0].value,
                        date: dateFormat,
                        accessToken: accessToken,
                    },
                }
            })
            .then(result => {
            })
            .catch(error => {
                console.error(error);
            });
        }

    } catch (err) {
        console.log(err)
        return "Erro ao inserir conta"
    }
}

const getAccountsInstagram = asyncHandler(async(req, res) => {
    try {
        const accountsInstagram = []

        for (const page of req.user.pages) {
            const { data: data } = await axios.get(`https://graph.facebook.com/v16.0/${page.idPage}?fields=instagram_business_account&access_token=${page.accessToken}`);

            if (data.hasOwnProperty("instagram_business_account")) {
                const { data: account } = await axios.get(`https://graph.facebook.com/v16.0/${data.instagram_business_account.id}?fields=username,profile_picture_url&access_token=${page.accessToken}`);

                const accountObj = {
                    ...account,
                    idPage: page.idPage
                }

                if (account) accountsInstagram.push(accountObj)
            }
        }
        
        res.json({ accountsInstagram: accountsInstagram })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Ocorreu um erro ao carregar as contas" })
    }
})

const importAccountsInstagram = asyncHandler(async(req, res) => {
    try {
        const { accounts } = req.body

        const date = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dateFormat = formater.format(date);

        for (const account of accounts) {
            const findPage = req.user.pages.find(page => page.idPage == account.idPage)

            if (findPage) {
                const { data } = await axios.get(`https://graph.facebook.com/v16.0/${account.idAccount}?fields=name,username,profile_picture_url&access_token=${findPage.accessToken}`);

                if (data) {
                    const accountExist = req.user.accountsIg.find(account => account.idAccount == data.id)

                    if (!accountExist) {
                        const saveAccount = await User.findByIdAndUpdate(req.user._id, {
                            $push: {
                                accountsIg: {
                                    idAccount: data.id,
                                    idPage: findPage.idPage,
                                    name: `${data.name}`,
                                    username: `${data.username}`,
                                    platform: "Instagram",
                                    photo: data.profile_picture_url,
                                    date: dateFormat
                                },
                            }
                        })
                    }
                }
            } else {
                continue
            }
        }
        
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Ocorreu um erro ao carregar as contas" })
    }
})

const removeAccount = asyncHandler(async(req, res) => {
    try {
        const { idAccount } = req.params

        if (req.body.platform === "Facebook") {
            const groups = []
            const pages = []
            const accountsInstagram = []
            
            for (const account of req.user.accountsIg) {
                const findPage = req.user.pages.find(item => item.idPage == account.idPage)

                if (findPage.idAccount != idAccount) {
                    accountsInstagram.push(account)
                }
            }

            for (const group of req.user.groups) {
                if (group.idAccount != idAccount) {
                    groups.push(group)
                }
            }

            for (const page of req.user.pages) {
                if (page.idAccount != idAccount) {
                    pages.push(page)
                }
            }

            const removeAccount = await User.findByIdAndUpdate(req.user._id, {
                pages: pages,
                groups: groups,
                accountsIg: accountsInstagram,
                $pull: {
                    accountsFb: {
                        idAccount: idAccount
                    }
                }
            })

            res.sendStatus(200)
        } else if (req.body.platform === "Instagram") {
            const removeAccount = await User.findByIdAndUpdate(req.user._id, {
                $pull: {
                    accountsIg: {
                        idAccount: idAccount
                    }
                }
            })

            res.sendStatus(200)
        }
    } catch (err) {
        res.send(err)
    }
})

module.exports = 
{   socialAccounts,
    newAccountFb,
    getAccountsInstagram,
    importAccountsInstagram,
    removeAccount
}