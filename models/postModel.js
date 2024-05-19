const mongoose = require('mongoose')
const { Schema } = mongoose;

const postSchema = new mongoose.Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    media: {
        type: String
    },
    link: {
        type: String
    },
    groups: {
        type: Array
    },
    pages: {
        type: Array
    },
    accountsInstagram: {
        type: Array
    },
    results: {
        type: Array,
        default: []
    },
    replyCommentsStatus: {
        type: Boolean
    },
    chatBotStatus: {
        type: Boolean
    },
    isSchedule: {
        type: Boolean
    },
    isPublished: {
        type: Boolean
    },
    typePost: {
        type: String
    },
    interval: {
        type: Number
    },
    scheduleDate: {
        type: Date
    },

    avatarUser: {
        type: String
    },
    nameUser: {
        type: String
    },

    scheduleDateFormatted: {
        type: String
    },
    createdAtFormatted: {
        type: String
    },

    limit: {
        type: String
    },
    answered: {
        type: String
    }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Post', postSchema);
