const TodoController = require('../controllers/todo.controller')
const TodoModel = require('../models/todo.model')
const httpMocks = require('node-mocks-http')
const allTodos = require('./mock-data/all-todos.json')

TodoModel.findByIdAndUpdate = jest.fn()

const validId = allTodos[0]._id
const invalidId = 'abc123'
const updateData = { done: true }
const updatedTodo = { ...allTodos[0], ...updateData }

let req, res, next
beforeEach(() => {
    jest.resetAllMocks()
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
    req.params.id = validId
    req.body = updateData
})

describe('TodoController.updateTodo tesztek (PATCH /todos/:id)', () => {
    it('should have an updateTodo function', () => {
        expect(typeof TodoController.updateTodo).toBe('function')
    })
    it('should call TodoModel.findByIdAndUpdate with id, body and options', async () => {
        await TodoController.updateTodo(req, res, next)
        expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(validId, updateData, {
            returnDocument: 'after',
            runValidators: true
        })
    })
    it('should return 200 and the updated todo as json', async () => {
        TodoModel.findByIdAndUpdate.mockResolvedValue(updatedTodo)
        await TodoController.updateTodo(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(updatedTodo)
    })
    it('should return 404 when the todo does not exist', async () => {
        TodoModel.findByIdAndUpdate.mockResolvedValue(null)
        await TodoController.updateTodo(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._getJSONData()).toStrictEqual({ message: 'A todo nem található' })
    })
    it('should return 400 for an invalid id and not call the model', async () => {
        req.params.id = invalidId
        await TodoController.updateTodo(req, res, next)
        expect(res.statusCode).toBe(400)
        expect(TodoModel.findByIdAndUpdate).not.toHaveBeenCalled()
    })
    it('should return 400 when the body is empty', async () => {
        req.body = {}
        await TodoController.updateTodo(req, res, next)
        expect(res.statusCode).toBe(400)
        expect(res._getJSONData()).toStrictEqual({ message: 'Nincs módosítandó adat' })
        expect(TodoModel.findByIdAndUpdate).not.toHaveBeenCalled()
    })
    it('should pass errors to next', async () => {
        const error = { name: 'ValidationError', message: 'done must be Boolean' }
        TodoModel.findByIdAndUpdate.mockRejectedValue(error)
        await TodoController.updateTodo(req, res, next)
        expect(next).toHaveBeenCalledWith(error)
        expect(res._isEndCalled()).toBeFalsy()
    })
})
