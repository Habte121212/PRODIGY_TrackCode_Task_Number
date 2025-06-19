const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const userRoutes = require('./routes/user')

//initialitions
const app = express()

//middlewares
app.use(express.json())

//routes
app.use('/api/auth', userRoutes)

//port
const port = process.env.PORT
app.listen(port, () => {
  console.log(`server is runnig on port ${port}`)
})
