const express = require("express");
const { check } = require("express-validator");
const spacesControllers = require("../controllers/spaces-controllers");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

// router.use(checkAuth);
router.get("/", spacesControllers.getSpacesByUserId);
router.post(
  "/",
  [check("name").not().isEmpty()],
  spacesControllers.createSpace
);
router.delete("/", spacesControllers.deleteSpace);
module.exports = router;
