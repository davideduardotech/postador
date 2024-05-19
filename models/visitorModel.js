const mongoose = require('mongoose')

const Visitor = new mongoose.Schema({
    ip: {
        type: String,
        require: true
    },
    refererUrl: {
        type: String,
        require: true
    }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

module.exports = mongoose.model('Visitor', Visitor);
