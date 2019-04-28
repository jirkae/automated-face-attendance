const express = require('express')
const bodyParser = require('body-parser')
const createDescriptor = require('../src/server/createDescriptor')

const app = express()

app.use(bodyParser.raw({
    limit: '1000kb',
    type: 'image/*',
  }))
app.use(express.static(__dirname + '/../dist'))
app.get('/', (req, res) => {
    res.sendFile('/index.html')
})


app.post('/create-descriptor', async (req, res) => {
    const contentType = req.header('content-type')
    const result = await createDescriptor(contentType, req.body.toString())
    res.send(JSON.stringify(result))
})
    
const PORT = process.env.PORT || 8080
app.listen(PORT)