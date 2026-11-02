const express = require('express')

const app = express()

app.get('/', (req, res)=>{
    res.json({ msg: 'Hello World' })
})

app.listen(3000, ()=>{
    console.log("A szerver elindult...");
})