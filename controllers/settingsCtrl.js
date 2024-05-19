const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const moment = require('moment-timezone')

const User = require('../models/userModel')
const Finance = require('../models/financeModel')
const Plan = require('../models/planModel')

const settings = asyncHandler(async (req, res) => {
  const finances = await Finance.find({idUser: req.user._id})
  let nextPayment;

  for (const finance of finances) {
    const findPlan = await Plan.findByIdAndUpdate(finance.plan).select("title")

    if (findPlan) {
      finance.titlePlan = findPlan.title
    } else {
      finance.titlePlan = "Plano alterado ou excluído"
    }

    const createdAt = moment.utc(finance.createdAt);
    finance.createdAtFormatted = createdAt.format("DD/MM/YYYY");

    nextPayment = createdAt.add(1, 'month').format("DD/MM/YYYY");
  }

  res.render('layouts/app/settings', { user: req.user, finances: finances, nextPayment: nextPayment })
})

const updateAccount = asyncHandler(async (req, res) => {
  try {
    let existsEmail = false

    if (req.body.email !== req.user.email) {
      const findEmail = await User.findOne({ email: req.body.email.trim() }).select("email")

      if (findEmail) existsEmail = true
    }

    if (!existsEmail) {
      const updateUser = await User.findByIdAndUpdate(req.user._id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        cpf: req.body.cpf
      })

      if (updateUser) {
        res.sendStatus(200)
      } else {
        res.status(500).json({ error: "Não foi possível salvar os dados" })
      }
    } else {
      res.status(500).json({ error: "Email existente" })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Erro interno no servidor" })
  }
})

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body

  if (newPassword != confirmPassword) return res.status(500).json({ error: "As senhas não conferem" })
  else {
    const findUser = await User.findById(req.user._id)

    if (await findUser.isPasswordMatched(currentPassword)) {
      const updateUser = await User.findByIdAndUpdate(req.user._id, {
        password: await bcrypt.hash(newPassword, 10)
      })

      if (updateUser) {
        res.sendStatus(200)
      } else {
        res.status(500).json({ error: "Não foi possível atualizar a senha" })
      }
    } else {
      res.status(500).json({ error: "Senha atual incorreta" })
    }
  }
})

module.exports =
{
  settings,
  updateAccount,
  updatePassword
}