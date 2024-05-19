const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    cpf: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    pages: {
        type: Array,
        default: []
    },
    pagesSets: {
        type: Array,
        default: []
    },
    groups: {
        type: Array,
        default: []
    },
    groupsSets: {
        type: Array,
        default: []
    },
    accountsFb: {
        type: Array,
        default: []
    },
    accountsIg: {
        type: Array,
        default: []
    },
    accountsIg: {
        type: Array,
        default: []
    },
    standardAnswers: {
        type: Array,
        default: []
    },
    plan: {
        type: String,
        require: true
    },
    isAdmin: {
        type: Boolean,
        require: true,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: "" 
    },
    lastPayment: {
        type: String,
    },
    invoices: {
        type: Array,
        default: []
    },
    token: {
        value: {
          type: String,
          default: null
        },
        expiration: {
          type: Date,
          default: null
        }
    },
    refreshToken: {
        type: String,
    },
    createdAtFormatted: {
        type: String,
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
    },
    {
        timestamps: true,
        versionKey: false
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    const date = new Date()
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    this.passwordResetExpires = date.getTime() + 10 * 60 * 1000
    return resetToken
}

module.exports = mongoose.model('User', userSchema)
