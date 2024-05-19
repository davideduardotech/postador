const mongoose = require('mongoose')
const { Schema } = mongoose;

const Finances = new mongoose.Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    nameUser: {
        type: String,
        require: true
    },
    avatarUser: {
        type: String,
        require: true
    },
    titlePlan: {
        type: String,
        require: true
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan'
    },
    idPayment: {
        type: String,
        require: true
    },
    typePayment: {
        type: String,
        require: true
    },
    amount: {
        type: Number,
        require: true
    },
    pix: {
        type: Object,
        require: true
    },
    creditCard: {
        type: Object,
        require: true
    },
    createdAtFormatted: {
        type: String,
    }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Finances', Finances);
