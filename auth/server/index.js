const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const cors = require('cors')
const userRoutes = require('./routes/user')

//initialitions
const app = express()

//middlewares
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(express.json())

//routes
app.use('/api/auth', userRoutes)

//port
const port = process.env.PORT
app.listen(port, () => {
  console.log(`server is runnig on port ${port}`)
})
