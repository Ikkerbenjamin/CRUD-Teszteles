const TodoController = require('../controllers/todo.controller')
const TodoModel = require('../models/todo.model')
const httpMocks = require('node-mocks-http')
const allTodos = require('./mock-data/all-todos.json')

TodoModel.find = jest.fn()
TodoModel.findById = jest.fn()

const validId = allTodos[0]._id
const invalidId = 'abc123'

let req, res, next
beforeEach(() => {
    jest.resetAllMocks()
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
})

describe('TodoController.getTodos tesztek (GET /todos)', () => {
    it('should have a getTodos function', () => {
        expect(typeof TodoController.getTodos).toBe('function')
    })
    it('should call TodoModel.find with empty filter', async () => {
        await TodoController.getTodos(req, res, next)
        expect(TodoModel.find).toHaveBeenCalledWith({})
    })
    it('should return 200 response code', async () => {
        TodoModel.find.mockResolvedValue(allTodos)
        await TodoController.getTodos(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it('should return all todos as json', async () => {
        TodoModel.find.mockResolvedValue(allTodos)
        await TodoController.getTodos(req, res, next)
        expect(res._getJSONData()).toStrictEqual(allTodos)
    })
    it('should return an empty array when there are no todos', async () => {
        TodoModel.find.mockResolvedValue([])
        await TodoController.getTodos(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual([])
    })
    it('should pass errors to next', async () => {
        const error = { message: 'Adatbázis hiba' }
        TodoModel.find.mockRejectedValue(error)
        await TodoController.getTodos(req, res, next)
        expect(next).toHaveBeenCalledWith(error)
        expect(res._isEndCalled()).toBeFalsy()
    })
})

describe('TodoController.getTodoById tesztek (GET /todos/:id)', () => {
    beforeEach(() => {
        req.params.id = validId
    })
    it('should have a getTodoById function', () => {
        expect(typeof TodoController.getTodoById).toBe('function')
    })
    it('should call TodoModel.findById with the id', async () => {
        await TodoController.getTodoById(req, res, next)
        expect(TodoModel.findById).toHaveBeenCalledWith(validId)
    })
    it('should return 200 and the todo as json', async () => {
        TodoModel.findById.mockResolvedValue(allTodos[0])
        await TodoController.getTodoById(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(allTodos[0])
    })
    it('should return 404 when the todo does not exist', async () => {
        TodoModel.findById.mockResolvedValue(null)
        await TodoController.getTodoById(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._getJSONData()).toStrictEqual({ message: 'A todo nem található' })
    })
    it('should return 400 for an invalid id and not call the model', async () => {
        req.params.id = invalidId
        await TodoController.getTodoById(req, res, next)
        expect(res.statusCode).toBe(400)
        expect(TodoModel.findById).not.toHaveBeenCalled()
    })
    it('should pass errors to next', async () => {
        const error = { message: 'Adatbázis hiba' }
        TodoModel.findById.mockRejectedValue(error)
        await TodoController.getTodoById(req, res, next)
        expect(next).toHaveBeenCalledWith(error)
        expect(res._isEndCalled()).toBeFalsy()
    })
})
