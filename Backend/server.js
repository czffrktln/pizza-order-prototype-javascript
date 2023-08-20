const express = require('express')
const fs = require('fs')
const path = require('path')
const fileUpload = require('express-fileupload')
const { json } = require('body-parser')

const server = express()
const port = 3000

server.use(express.json())
server.use(fileUpload())


server.get('/', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/index.html`))
})

server.use('/', express.static(`${__dirname}/../frontend`))

server.listen(port, () => {
    console.log(`Server running on localhost:${port}`)
})

server.get('/pizzas', (req, res) => {
    const data = fs.readFileSync(`${__dirname}/pizzas.json`)
    const pizzas = JSON.parse(data)
    
    res.json(pizzas)
})

server.post("/order", (req, res) => {
    fs.readdir(__dirname+"/orders", (err, files) => {
     if (err) {
       console.log(err);
     } else {
       const counter = files.length+1;
       console.log(counter)
       let totalOrder = JSON.stringify(req.body);
       console.log(`orders/totalOrder_${counter}.json`)
       fs.writeFileSync(`orders/totalOrder_${counter}.json`, totalOrder);
     }
     res.sendStatus(200)
   });
 });