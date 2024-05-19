const nodemailer = require('nodemailer');
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
require('dotenv').config()

// SMTP (sending) server details
const smtpServer = 'smtp.gmail.com';
const smtpPort = 465;

const transporter = nodemailer.createTransport({
  host: smtpServer,
  port: smtpPort,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
});


async function sendEmailTokenPassword(data) {
  try {
    const filePath = path.join(__dirname, '..', 'templates', 'auth', 'forgot-password.ejs');
    const emailTemplate = fs.readFileSync(filePath, 'utf-8');
    const html = ejs.render(emailTemplate, data);

    let mailOptions = {
      from: '"pluBee" no-reply@plubee.net',
      to: data.email,
      subject: 'Redefinição de senha',
      html: html
    };

    const sendEmail = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function sendEmailApprovedPayment(data) {
  try {
    const filePath = path.join(__dirname, '..', 'templates', 'checkout', 'success-payment.ejs');
    const emailTemplate = fs.readFileSync(filePath, 'utf-8');
    const html = ejs.render(emailTemplate, data);

    let mailOptions = {
      from: '"PluBee" plubee.net',
      to: data.email,
      subject: 'Compra aprovada com sucesso!',
      text: 'Você já pode aproveitar todos os benefícios da nossa plataforma!',
      html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(`@NodeMailer ocorreu um erro ao tentar enviar email para o destinatário ${data.email}:\n|   ${error}`);
      }
    });
  } catch (error) {
    console.log(`function aprovedEmail | @Error ${error}`);
  }
}

module.exports = {
  sendEmailTokenPassword,
  sendEmailApprovedPayment
}