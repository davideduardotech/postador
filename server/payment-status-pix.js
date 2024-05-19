const moment = require('moment-timezone');
const mongoose = require('mongoose');
const axios = require('axios');

const { sendEmailApprovedPayment } = require("../controllers/emailCtrl")

const User = require('../models/userModel')
const Plan = require('../models/planModel')
const Pix = require('../models/pixModel');
const Finance = require('../models/financeModel')

mongoose.connect('mongodb://127.0.0.1:27017/pluBee', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  async function checkPayment() {
    const findPayments = await Pix.find({});
  
    if (findPayments) {
      const now = moment();
  
      for (const payment of findPayments) {
        const paymentDateTime = moment(payment.date);
  
        if (now.diff(paymentDateTime, 'minutes') >= 15) {
          const deletePayment = await Pix.findByIdAndDelete(payment._id)
        } else {
          const response = await axios.get(`https://api.mercadopago.com/v1/payments/${payment.pix.id}`, {
            headers: {
              Authorization: 'Bearer APP_USR-1680886342878290-011613-a8697bc1e7bdc9a7003609de727629c1-810849321',
            },
          });

          if (response.data.status == "pending") {
            const findPlan = await Plan.findById(payment.plan)

            const createUser = await User.create({
              name: payment.name,
              phone: payment.phone,
              email: payment.email,
              password: payment.password,
              cpf: payment.cpf,
              plan: findPlan.title
            });

            if (createUser) {
              const saveFinance = await Finance.create({
                idUser: createUser._id,
                plan: findPlan._id,
                idPayment: response.data.id,
                typePayment: "pix",
                amount: parseFloat(findPlan.valueMonth),
                pix: response.body
              });

              const dataFormat = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              }).format(Date.now());
    
              let dataPayment = {
                id: response.data.id,
                amount: `R$${findPlan.valueMonth},00`,
                name: createUser.name,
                date: dataFormat,
                plan: findPlan.title,
                email: createUser.email
              };

              const deletePayment = await Pix.findByIdAndDelete(payment._id)
    
              await sendEmailApprovedPayment(dataPayment);
            }
          } else {
            continue
          }
        }
      }
    }
  }

  let processFinished = true;

  setInterval(async () => {
    try {
      if (!processFinished) {
        return
      }

      processFinished = false;

      const checkStatusPayments = await checkPayment()

      processFinished = true;
    } catch (err) {
      console.log(err)
      processFinished = true;
    }
  }, 10000);
});