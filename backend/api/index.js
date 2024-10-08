const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 5000
const placesRoutes = require('../routes/places-routes')
const usersRoutes = require('../routes/users-routes')
const HttpError = require('../models/http-error')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()

app.use(bodyParser.json())
app.use(cors({ origin: 'http://localhost:5173', methods:["GET", "POST", "PUT", "PATCH", "DELETE"] }));
app.use('/uploads/images', express.static(path.join('uploads', 'images')))
app.use(express.static(path.join('public')))
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next()
})
app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes)
// app.use((req, res, next) => {
//     const error = new HttpError('Could not find this route.', 404)
//     throw error
// })
app.use((req, res, next)=>{
    res.sendFile(path.ressolve(__dirname, 'public', 'index.html'))
})
app.use((error, req, res, next) => {
    if(req.file){
        fs.unlink(req.file.path, err=>{
            console.log(err)
        })
    }
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occurred!' })
})
mongoose
.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hvxrnp5.mongodb.net/places?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
app.listen(process.env.PORT || port)
})
.catch(
    err =>{
        console.log(err)
    }
)