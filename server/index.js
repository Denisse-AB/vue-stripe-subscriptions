require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

// middleware
app.use(express.json())
app.use(cors())

// redirect to route folder
const posts = require('./routes/api/posts')
app.use('/api/posts', posts)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server is running on port ${port}.`))
