const mongoose = require('mongoose')

const planSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    nameCheckout: {
        type: String,
        require: true
    },
    valueMonth: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    quantityAccounts: {
        type: Number,
        default: 0
    },
    quantityGroups: {
        type: Number,
        default: 0
    },
    quantityPages: {
        type: Number,
        default: 0
    },
    quantitySchedule: {
        type: Number,
        default: 0
    },
    quantityReplyPosts: {
        type: Number,
        default: 0
    },
    quantityComments: {
        type: Number,
        default: 0
    },
    quantitySets: {
        type: Number,
        default: 0
    },
    selectAll: {
        type: Boolean,
        default: false
    },
    standardAnswers: {
        type: Boolean,
        default: false
    },
    marked: {
        type: Boolean,
        default: false
    },
    },
    {
        versionKey: false
    }
)



const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
