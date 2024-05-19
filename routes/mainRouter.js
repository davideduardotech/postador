const express = require('express')
const Plans = require('../models/planModel')
const Visitor = require('../models/visitorModel')
const router = express.Router()

router.get("/", async (req, res) => {
    const plans = await Plans.find({})

    res.render('layouts/main/index.ejs', { plans: plans })

    // Get visitor data
    const ip = req.clientIp;
    const refererUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    const existingVisitor = await Visitor.findOne({
        ip: ip,
        createdAt: { $gte: new Date(new Date() - 24 * 60 * 60 * 1000) }
    });

    if (!existingVisitor) {
        const createVisitor = await Visitor.create({ ip: ip, refererUrl: refererUrl });
    }
})

router.get("/privacy-policy", async (req, res) => {
    res.render('layouts/main/privacy-policy')
})

router.get("/terms-of-use", async (req, res) => {
    res.render('layouts/main/terms-of-use')
})

module.exports = router