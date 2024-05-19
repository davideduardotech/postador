const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { generateToken } = require('../config/jwtToken')
const { sendEmailTokenPassword } = require('./emailCtrl')

const login = asyncHandler(async (req, res) => {
    res.render('layouts/auth/login')
})

const forgotPassword = asyncHandler(async (req, res) => {
    res.render('layouts/auth/forgot-password')
})

const handleLogin = asyncHandler(async (req, res) => {
    try{
        const { email, password } = req.body
        console.log('email: ',email);
        console.log('password:', password);

        const findUser = await User.findOne({ email });

        if (findUser) {
            if (findUser.isBlocked) {
                res.status(500).json({ error: 'Não foi possível fazer login, o usuário está bloqueado.' })
            }

            if (await findUser.isPasswordMatched(password)) {
                const refreshToken = generateToken(findUser?.id)

                const updateUser = await User.findByIdAndUpdate(
                    findUser.id,
                    {
                        refreshToken: refreshToken,
                    }, { new: true }
                )

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 72 * 60 * 60 * 1000,
                })

                res.status(200).json({
                    token: generateToken(findUser._id),
                });
            } else {
                res.status(500).json({ error: 'Credenciais inválidas' })
            }
        } else {
            res.status(500).json({ error: 'Credenciais inválidas' })
        }
    }catch(error){
        return res.status(500).json({error: `${error}`});
    }
})

const sendToken = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body

        const findUser = await User.findOne({ email: email })

        if (!findUser) return res.status(500).json({ error: "Email inválido" })

        const token = await findUser.createPasswordResetToken()
        await findUser.save()

        const data = {
            name: findUser.name,
            email: findUser.email,
            token: token
        }

        await sendEmailTokenPassword(data)

        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Erro interno no servidor" })
    }
})

const validPasswordToken = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const findToken = await User.findOne({ passwordResetToken: hashedToken })

    if (findToken) {
        res.render('layouts/auth/reset-password', {token: token})
    } else {
        res.render('layouts/not-found')
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    if (password.length < 8) return res.status(500).json({ error: "A senha deve conter 8 caracteres ou mais" })

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const findToken = await User.findOne({ passwordResetToken: hashedToken })

    if (!findToken) return res.status(500).json({ error: "Token inválido ou expirado" })

    const passwordCrypt = await bcrypt.hash(password, 10);

    const resetPassword = await User.findOneAndUpdate(
        {
            passwordResetToken: hashedToken
        },
        {
            password: passwordCrypt,
            passwordResetToken: '',
            passwordResetExpires: '',
        },
        { new: true }
    );

    if (resetPassword) {
        res.sendStatus(200)
    } else {
        res.status(500).json({ error: "Não foi possível alterar a senha" })
    }
});

module.exports =
{
    login,
    forgotPassword,
    handleLogin,
    sendToken,
    validPasswordToken,
    resetPassword
}