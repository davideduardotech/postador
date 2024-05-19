const asyncHandler = require('express-async-handler');
const axios = require('axios');
const bcrypt = require('bcrypt')
const mercadopago = require('mercadopago');
const mongoose = require('mongoose');

const { sendEmailApprovedPayment } = require("../controllers/emailCtrl")

const Plan = require('../models/planModel');
const Pix = require('../models/pixModel');
const User = require('../models/userModel');
const Finance = require('../models/financeModel');


// Initialize Mercado Pago
mercadopago.configure({
  access_token: "APP_USR-1680886342878290-011613-a8697bc1e7bdc9a7003609de727629c1-810849321"
});


// Validate informations

async function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

async function validatePhoneNumber(phoneNumber) {
  const phonePattern = /^.{1,16}$/;
  return phonePattern.test(phoneNumber);
}

async function validateCPF(cpf) {
  const cleanedCPF = cpf.replace(/\D/g, '');

  if (cleanedCPF.length !== 11) {
    return false;
  }

  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanedCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanedCPF.substring(9, 10))) {
    return false;
  }
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanedCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanedCPF.substring(10, 11))) {
    return false;
  }

  return true;
}


// Checkout functions


const checkoutPage = asyncHandler(async (req, res) => {
  const findPlan = await Plan.findOne({ nameCheckout: req.params.name_checkout })

  if (findPlan) {
    res.render("layouts/main/checkout", { plan: findPlan })
  } else {
    res.render("layouts/not-found")
  }
})

const validateData = asyncHandler(async (req, res) => {
  try {
    const findUser = await User.findOne({email: req.body.email})

    if (findUser) return res.status(500).json({ valid: false, error: "Email existente" })

    const isEmailValid = await validateEmail(req.body.email);
    const isPhoneNumberValid = await validatePhoneNumber(req.body.phone);
    const isCPFValid = await validateCPF(req.body.cpf);

    if (isEmailValid && isPhoneNumberValid && isCPFValid) {
      return res.json({ valid: true })
    } else {
      return res.json({ valid: false, error: "Dados incorretos" })
    }
  } catch (err) {
    res.status(500).json({ error: "Erro temporário no servidor" })
  }
})

const createPaymentCreditCard = asyncHandler(async (req, res) => {
  try {
    const findPlan = await Plan.findOne({ nameCheckout: req.params.name_checkout });

    if (!findPlan) {
      return res.json({ status: "reproved", message: "informações do plano não encontrada, recarregue a pagina e tente novamente" });
    }

    req.body.checkoutData.amount = parseFloat(findPlan.valueMonth);
    req.body.paymentData.transaction_amount = parseFloat(findPlan.valueMonth);

    try {
      const response = await mercadopago.payment.create(req.body.paymentData);

      if (response.response.status === "approved") {
        const createUser = await User.create({
          name: `${req.body.checkoutData.firstName.trim()} ${req.body.checkoutData.lastName.trim()}`,
          phone: req.body.checkoutData.phone,
          email: req.body.checkoutData.email,
          password: req.body.checkoutData.password,
          cpf: req.body.checkoutData.cpf,
          plan: findPlan.title
        });

        if (createUser) {
          const saveFinance = await Finance.create({
            idUser: createUser._id,
            plan: findPlan._id,
            idPayment: response.body.id,
            typePayment: "credit_card",
            amount: parseFloat(findPlan.valueMonth),
            creditCard: response.response
          });

          const dataFormat = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).format(Date.now());

          req.body.checkoutData.type_payment = "credit_card";
          req.body.checkoutData.credit_card = response.response;

          let dataPayment = {
            id: response.body.id,
            amount: `R$${findPlan.valueMonth},00`,
            name: createUser.name,
            date: dataFormat,
            plan: findPlan.title,
            email: createUser.email
          };

          await sendEmailApprovedPayment(dataPayment);

          return res.json({ status: "approved", message: `Pagamento realizado | R$${req.body.checkoutData.amount} reais`, id_payment: response.body.id });
        }
      } else {
        return res.json({ status: "reproved", message: "Pagamento não aprovado" });
      }
    } catch (error) {
      console.log(`@Error ${error}`);
      return res.json({ status: "reproved", message: `${error}` });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro temporário no servidor" })
  }
});

const createPaymentPix = asyncHandler(async (req, res) => {
  try {
    const findPlan = await Plan.findOne({ nameCheckout: req.params.name_checkout });

    const paymentData = {
      transaction_amount: parseFloat(findPlan.valueMonth),
      payment_method_id: "pix",
      description: `${findPlan.title} sendo contratado na plataforma plubee.net`,
      payer: {
        first_name: req.body.user.firstName,
        last_name: req.body.user.lastName,
        email: req.body.user.email,
        identification: {
          type: "CPF",
          number: req.body.user.cpf,
        },
      }
    };

    const response = await mercadopago.payment.create(paymentData)

    response.response.point_of_interaction.transaction_data.id = response.response.id

    const savePix = await Pix.create({
      name: `${req.body.user.firstName.trim()} ${req.body.user.lastName.trim()}`,
      email: req.body.user.email,
      phone: req.body.user.phone,
      cpf: req.body.user.cpf,
      password: await bcrypt.hash(req.body.user.password, 12),
      plan: findPlan._id,
      amount: findPlan.valueMonth,
      pix: response.response.point_of_interaction.transaction_data
    });

    res.json({
      qr_code_base64: response.response.point_of_interaction.transaction_data.qr_code_base64,
      id_checkout_pix: savePix._id
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

const checkStatusPix = asyncHandler(async (req, res) => {
  try {
    const findPaymentPix = await Pix.findById(req.body.id_checkout_pix);

    if (findPaymentPix) {
      const response = await axios.get(`https://api.mercadopago.com/v1/payments/${findPaymentPix.pix.id}`, {
        headers: {
          Authorization: `Bearer APP_USR-1680886342878290-011613-a8697bc1e7bdc9a7003609de727629c1-810849321`,
        },
      });

      if (process.env.MODE == "DEV") {
        response.data.status = "approved";
      }

      if (response.data.status == "approved") {
        res.json({ approved: true })
      } else {
        res.json({ approved: false })
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Erro temporário no servidor" })
  }
})

module.exports =
{
  checkoutPage,
  checkStatusPix,
  createPaymentCreditCard,
  createPaymentPix,
  validateData
}