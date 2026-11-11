const TodoController = require('../controllers/todo.controller')
const TodoModel = require('../models/todo.model')
const httpMocks = require('node-mocks-http')
const newTodo = require('./mock-data/new-todo.json')
const allTodos = require('./mock-data/all-todos.json')

TodoModel.create = jest.fn()
TodoModel.findByIdAndDelete = jest.fn()

const validId = allTodos[0]._id
const invalidId = 'abc123'

let req, res, next
beforeEach(() => {
    jest.resetAllMocks()
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
})

describe('TodoController.createTodo tesztek (POST /todos)', () => {
    beforeEach(() => {
        req.body = newTodo
    })
    it('should have a createTodo function', () => {
        expect(typeof TodoController.createTodo).toBe('function')
    })
    it('should call TodoModel.create with the request body', async () => {
        await TodoController.createTodo(req, res, next)
        expect(TodoModel.create).toHaveBeenCalledWith(newTodo)
    })
    it('should return 201 response code', async () => {
        TodoModel.create.mockResolvedValue(newTodo)
        await TodoController.createTodo(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it('should return json body in response', async () => {
        TodoModel.create.mockResolvedValue(newTodo)
        await TodoController.createTodo(req, res, next)
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })
    it('should pass validation errors to next', async () => {
        req.body = { title: 'Hiányzik a done' }
        const error = { name: 'ValidationError', message: 'done is required' }
        TodoModel.create.mockRejectedValue(error)
        await TodoController.createTodo(req, res, next)
        expect(next).toHaveBeenCalledWith(error)
        expect(res._isEndCalled()).toBeFalsy()
    })
    it('should not call next on success', async () => {
        TodoModel.create.mockResolvedValue(newTodo)
        await TodoController.createTodo(req, res, next)
        expect(next).not.toHaveBeenCalled()
    })
})

describe('TodoController.deleteTodo tesztek (DELETE /todos/:id)', () => {
    beforeEach(() => {
        req.params.id = validId
    })
    it('should have a deleteTodo function', () => {
        expect(typeof TodoController.deleteTodo).toBe('function')
    })
    it('should call TodoModel.findByIdAndDelete with the id', async () => {
        await TodoController.deleteTodo(req, res, next)
        expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(validId)
    })
    it('should return 200 and the deleted todo as json', async () => {
        TodoModel.findByIdAndDelete.mockResolvedValue(allTodos[0])
        await TodoController.deleteTodo(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(allTodos[0])
    })
    it('should return 404 when the todo does not exist', async () => {
        TodoModel.findByIdAndDelete.mockResolvedValue(null)
        await TodoController.deleteTodo(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._getJSONData()).toStrictEqual({ message: 'A todo nem található' })
    })
    it('should return 400 for an invalid id and not call the model', async () => {
        req.params.id = invalidId
        await TodoController.deleteTodo(req, res, next)
        expect(res.statusCode).toBe(400)
        expect(TodoModel.findByIdAndDelete).not.toHaveBeenCalled()
    })
    it('should pass errors to next', async () => {
        const error = { message: 'Adatbázis hiba' }
        TodoModel.findByIdAndDelete.mockRejectedValue(error)
        await TodoController.deleteTodo(req, res, next)
        expect(next).toHaveBeenCalledWith(error)
        expect(res._isEndCalled()).toBeFalsy()
    })
})
