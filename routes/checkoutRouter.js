const express = require('express')
const router = express.Router()

const {
    checkoutPage,
    createPaymentCreditCard,
    createPaymentPix,
    checkStatusPix,
    validateData,
} = require('../controllers/checkoutCtrl')

router.get("/payment/:name_checkout", checkoutPage);
router.post("/create-payment/credit-card/:name_checkout", createPaymentCreditCard);
router.post("/create-payment/pix/:name_checkout", createPaymentPix);
router.post("/validate-data", validateData);
router.post("/check-status-pix", checkStatusPix)

module.exports = router