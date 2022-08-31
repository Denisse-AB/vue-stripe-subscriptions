require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

// middleware
app.use((req, res, next) => {
  if (req.originalUrl === '/stripe/webhook') {
    next()
  } else {
    express.json()(req, res, next)
  }
})
app.use(cors())

// redirect to route folder
const stripe = require('./routes/stripe')
app.use('/stripe', stripe)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server is running on port ${port}.`))
