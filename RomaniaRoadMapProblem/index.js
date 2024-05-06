const express = require('express')

const app = express()
const port = 80

app.use(express.static(__dirname))
app.use(express.static(__dirname + '/../'))

app.get('/', (req, res) => res.sendFile('index.html', { root: __dirname, }))

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`)
})

