const express = require('express')
const TodoController = require('../controllers/todo.controller')

const router = express.Router()

router.get('/', TodoController.getTodos)
router.get('/:id', TodoController.getTodoById)
router.post('/', TodoController.createTodo)
router.patch('/:id', TodoController.updateTodo)
router.delete('/:id', TodoController.deleteTodo)

module.exports = router
