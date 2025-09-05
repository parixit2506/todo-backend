const express = require('express');
const router = express.Router();
const {createTodo, getTodos, getTodoById, updateTodo, deleteTodo} = require('../controllers/todos');

const authenticate = require("../../middleware/auth");

router.use(authenticate);
router.post("/createTodo", createTodo);
router.get("/getTodos", getTodos);
router.get("/getTodo/:id", getTodoById)
router.put("/updateTodo/:id", updateTodo);
router.delete("/deleteTodo/:id", deleteTodo);

module.exports = router;