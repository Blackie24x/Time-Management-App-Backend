const express = require("express");
const { check } = require("express-validator");
const usersController = require("../controllers/users-controllers");
const router = express.Router();

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail().not().isEmpty(),
    check("password").not().isEmpty(),
  ],
  usersController.signup
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail().not().isEmpty(),
    check("password").not().isEmpty(),
  ],
  usersController.login
);
router.patch("/stats", usersController.updateStats);

module.exports = router;
