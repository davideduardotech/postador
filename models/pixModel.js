const mongoose = require('mongoose')
const { Schema } = mongoose;

const Pix = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    cpf: {
        type: String,
        require: true
    },
    password: {
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
    amount: {
        type: Number,
        require: true
    },
    pix: {
        type: Object,
        require: true
    }
    },
    {
        versionKey: false
    }
)

module.exports = mongoose.model('PixPayments', Pix);
