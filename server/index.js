require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

// middleware
app.use(express.json())
app.use(cors()) // TODO: set options on production

// redirect to route folder
const posts = require('./routes/api/posts')
app.use('/api/posts', posts)

// Handle production
if (process.env.NODE_ENV === 'production') {
  // static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server is running on port ${port}.`))
