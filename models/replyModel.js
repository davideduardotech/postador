const mongoose = require('mongoose')
const { Schema } = mongoose;

const Reply = new mongoose.Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    idPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    contents: {
        type: Array,
        require: true
    },
    limit: {
        type: Number,
        require: true
    },
    answered: {
        type: Array,
        default: []
    },
    status: {
        type: Boolean,
        default: true
    }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Reply', Reply);
