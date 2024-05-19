const asyncHandler = require('express-async-handler')
const moment = require('moment-timezone')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const User = require('../models/userModel')
const Post = require('../models/postModel')
const Plan = require('../models/planModel')
const Finance = require('../models/financeModel')
const Visitor = require('../models/visitorModel')


// ###################### //
// ##     MÉTRICAS     ## //
// ###################### //

const metrics = asyncHandler(async (req, res) => {
    res.render('layouts/app/admin/metrics', { user: req.user })
})

const getDataMetrics = asyncHandler(async (req, res) => {
    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const startDate = new Date(`${currentYear}-${currentMonth + 1}`);
    const endDate = new Date(new Date(currentDate).setMonth(currentDate.getMonth() + 1, 0));

    const financesCurrentMonth = await Finance.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
    ]);

    const financesCharts = await Finance.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                totalAmount: { $sum: "$amount" }
            }
        },
        {
            $match: {
                "_id.year": currentYear
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]);

    const revenue = financesCurrentMonth.reduce((total, finance) => total + finance.amount, 0);

    const users = await User.countDocuments();
    
    const posts = await Post.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    platform: "$platform"
                },
                count: { $sum: 1 }
            }
        },
        {
            $match: {
                "_id.year": currentYear
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]);

    const visitors = await Visitor.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                count: { $sum: 1 }
            }
        },
        {
            $match: {
                "_id.year": currentYear
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        }
    ]);

    res.status(200).json({
        financesCurrentMonth,
        financesCharts,
        revenue,
        users,
        posts,
        visitors
    });
});



// ##################### //
// ##      USERS      ## //
// ##################### //

const users = asyncHandler(async (req, res) => {
    const findUsers = await User.find({}).select("name avatar email phone cpf plan createdAt")
    const findPlans = await Plan.find({})

    for (const user of findUsers) {
        const createdAt = moment.utc(user.createdAt);

        user.createdAtFormatted = createdAt.format("DD/MM/YYYY");
    }

    res.render('layouts/app/admin/users', { user: req.user, users: findUsers, plans: findPlans })
})

const saveUser = asyncHandler(async (req, res) => {
    try {
        const findUser = await User.findOne({ email: req.body.email })

        if (findUser) return res.status(500).json({ error: "Email existente" })

        const dataUser = {
            ...req.body,
            isAdmin: (req.body.plan == "Administrador") ? true : false
        }

        const newUser = await User.create(dataUser)

        if (newUser) {
            res.sendStatus(200)
        } else {
            res.status(500).json({ error: "Não foi possível criar o usuário" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Erro interno no servidor" })
    }
})

const updateUser = asyncHandler(async (req, res) => {
    try {
        const findUser = await User.findById(req.params.id)

        if (findUser.email != req.body.email) {
            const findEmail = await User.findOne({ email: req.body.email })

            if (findEmail) return res.status(500).json({ error: "Email existente" })
        }

        const dataUser = {
            ...req.body,
            isAdmin: (req.body.plan == "Administrador") ? true : false
        }

        if (dataUser.password.length > 0) {
            dataUser.password = await bcrypt.hash(dataUser.password, 10)
        } else {
            delete dataUser.password
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id, dataUser)

        if (updateUser) {
            res.sendStatus(200)
        } else {
            res.status(500).json({ error: "Não foi possível atualizar o usuário" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Erro interno no servidor" })
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    try {
        const deletePosts = await Post.deleteMany({ idUser: new ObjectId(req.params.id) })
        const deleteUser = await User.findByIdAndDelete(req.params.id)

        if (deleteUser) {
            res.sendStatus(200)
        } else {
            res.status(500).json({ error: "Não foi possível deletar o usuário" })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Erro interno no servidor" })
    }
})


// ###################### //
// ##     FINANCES     ## //
// ###################### //

const finances = asyncHandler(async (req, res) => {
    const finances = await Finance.find({})

    for (const finance of finances) {
        const findUser = await User.findById(finance.idUser).select("name avatar")
        const findPlan = await Plan.findByIdAndUpdate(finance.plan).select("title")

        if (findUser) {
            finance.avatarUser = findUser.avatar
            finance.nameUser = findUser.name
        } else {
            finance.avatarUser = ""
            finance.nameUser = "Usuário excluído"
        }

        if (findPlan) {
            finance.titlePlan = findPlan.title
        } else {
            finance.titlePlan = "Plano alterado ou excluído"
        }

        const createdAt = moment.utc(finance.createdAt);
        finance.createdAtFormatted = createdAt.format("DD/MM/YYYY HH:MM");
    }

    res.render('layouts/app/admin/finances', { user: req.user, finances: finances })
})


// #####################$ //
// ##      PLANOS      ## //
// #####################$ //

const plans = asyncHandler(async (req, res) => {
    const plans = await Plan.find({})

    res.render('layouts/app/admin/plans', { user: req.user, plans: plans })
})

const updatePlan = asyncHandler(async (req, res) => {
    try {
        const findPlan = await Plan.findById(req.params.id)

        if (findPlan.title != req.body.title) {
            const findUsers = await User.find({ plan: findPlan.title })

            for (const user of findUsers) {
                const updateUser = await User.findByIdAndUpdate(user._id, { plan: req.body.title })
            }
        }

        const updatePlan = await Plan.findByIdAndUpdate(req.params.id, req.body)

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Erro interno no servidor" })
    }
})

module.exports = {
    metrics,
    getDataMetrics,
    users,
    saveUser,
    updateUser,
    deleteUser,
    finances,
    plans,
    updatePlan
}