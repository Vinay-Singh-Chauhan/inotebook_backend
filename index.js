const connectToMongo=require('./db');
const dotenv = require('dotenv');
dotenv.config({ path: './.env.local' });
const express = require('express')
// var express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT

app.use(cors())
connectToMongo();
app.use(express.json())
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})