const HttpError = require('../models/http-error')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) =>{
    if(req.method === 'OPTIONS'){
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token){
            throw new Error('Authentication failed!', 401)
        }
       const decodedToken = jwt.verify(token,"kattappa_ne_bahubali_ko_qn_mara?")
        req.userData = {userId: decodedToken.userId}
        next()
    } catch (err) {
        const error = new HttpError('Authentication failed!', 401)
        return next(error) 
    }   
}