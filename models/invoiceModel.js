const mongoose = require('mongoose')
const { Schema } = mongoose;

const invoiceSchema = new mongoose.Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    plan: {
        type: String,
        require: true
    },
    value: {
        type: Number,
        require: true
    },
    status: {
        type: String,
    },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

module.exports = mongoose.model('Invoice', invoiceSchema);
