const express = require("express");
const { check } = require("express-validator");
const notesControllers = require("../controllers/notes-controllers");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.get("/", notesControllers.getNotesByUserId);
router.post("/", notesControllers.createNote);
router.patch("/", notesControllers.updateNote);
router.delete("/", notesControllers.deleteNote);

module.exports = router;
