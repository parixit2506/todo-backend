const express = require('express');
const router = express.Router();

const todoRouter = require('./todosRoutes');
const userRouter = require('./userRoutes');


router.use('/todos', todoRouter);
router.use('/users', userRouter);


module.exports = router;