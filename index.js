const express = require('express')
const app = express();
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000

//middlewares
app.use(cors())
app.use(express.json())

//mongodb connection
mongoose.connect(process.env.MONGO_URL)
.then( console.log('mongodb connected'))
.catch(err=>console.log(err))





app.get('/',(req,res)=>{
    res.send('othoba-mart backend api')
})

app.listen(port, ()=>{
    console.log('backend api is running on',port)
})