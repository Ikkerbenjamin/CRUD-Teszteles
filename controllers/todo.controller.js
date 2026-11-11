const mongoose = require('mongoose')
const TodoModel = require('../models/todo.model')

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

exports.createTodo = async (req, res, next) => {
    try {
        const createdTodo = await TodoModel.create(req.body)
        res.status(201).json(createdTodo)
    } catch (err) {
        next(err)
    }
}

exports.getTodos = async (req, res, next) => {
    try {
        const todos = await TodoModel.find({})
        res.status(200).json(todos)
    } catch (err) {
        next(err)
    }
}

exports.getTodoById = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Érvénytelen azonosító' })
        }
        const todo = await TodoModel.findById(id)
        if (!todo) {
            return res.status(404).json({ message: 'A todo nem található' })
        }
        res.status(200).json(todo)
    } catch (err) {
        next(err)
    }
}

exports.updateTodo = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Érvénytelen azonosító' })
        }
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'Nincs módosítandó adat' })
        }
        const updatedTodo = await TodoModel.findByIdAndUpdate(id, req.body, {
            returnDocument: 'after',
            runValidators: true
        })
        if (!updatedTodo) {
            return res.status(404).json({ message: 'A todo nem található' })
        }
        res.status(200).json(updatedTodo)
    } catch (err) {
        next(err)
    }
}

exports.deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params
        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Érvénytelen azonosító' })
        }
        const deletedTodo = await TodoModel.findByIdAndDelete(id)
        if (!deletedTodo) {
            return res.status(404).json({ message: 'A todo nem található' })
        }
        res.status(200).json(deletedTodo)
    } catch (err) {
        next(err)
    }
}
