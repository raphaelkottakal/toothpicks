const express = require('express')
var compression = require('compression')
const app = express()
const port = process.env.PORT || 3000

app.use(compression())
app.use(express.static('build'))

app.listen(port, () => console.log(`Listening on port ${port}!`))