const express = require('express')
const mongoose = require('mongoose')
const todoRoutes = require('./routes/todo.routes')

const app = express()
const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/todo-api'

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ msg: 'Hello World' })
})

app.use('/todos', todoRoutes)

app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message })
    }
    res.status(500).json({ message: err.message })
})

mongoose.connect(MONGO_URL)
    .then(() => console.log('Kapcsolódva a MongoDB-hez'))
    .catch(err => console.error('MongoDB hiba:', err.message))

app.listen(3000, () => {
    console.log("A szerver elindult...")
})
