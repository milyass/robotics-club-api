const express = require("express")
const usersRouter = new express.Router()
const usersController = require("../controllers/users")
const passport = require('passport');

usersRouter.post("/login",
  passport.authenticate('local'),
  (req, res, next) => {
      return res.json({
        status: "success"
      })
  }
)

usersRouter.post("/register", async (req, res, next) => {
  try {
    const result = await usersController.Create(req.body)
    return res.json({
      result
    })
  } catch (error) {
    next(error)
  }
});

usersRouter.get("/me", async (req, res, next) => {
  try {
    return res.json({
      success: "success",
      user: req.user
    })
  } catch (error) {
    next(error)
  }
});

module.exports = usersRouter;