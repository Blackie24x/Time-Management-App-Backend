const express = require("express");
const { check } = require("express-validator");
const tasksControllers = require("../controllers/tasks-controllers");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

// router.use(checkAuth);

router.post("/", tasksControllers.createTask);
router.delete("/", tasksControllers.deleteTask);
router.get("/", tasksControllers.getTasksByUserId);
router.patch("/", tasksControllers.updateTask);
module.exports = router;
