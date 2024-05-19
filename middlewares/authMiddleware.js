const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token

  if (req?.cookies?.token) {
    token = req.cookies.token

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    
    if (user) {
      req.user = user
      next()
    } else {
      res.redirect("/auth")
    }
  } else {
    res.redirect("/auth")
  }
})

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.isAdmin) {
    next()
  } else {
    res.render("layouts/not-found")
  }
})

module.exports = {
  authMiddleware,
  isAdmin
}