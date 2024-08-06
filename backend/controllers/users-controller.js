const uuid = require('uuid')
const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')
const User = require('../models/user')

const getUsers = async (req, res,next) => {
    // res.json({ users: DUMMY_USERS })
    let users;
    try{
        users = await User.find({}, '-password')
    }catch(err){
        const error = new HttpError('Fetching users failed, please try again later',500)
        return next(error)
    }
    res.json(({users: users.map(user=> user.toObject({getters: true}))}))
}

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        console.error('Error during User.findOne:', err);
        const error = new HttpError("Signing up failed, please try again", 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError("User already exists, try signing in", 422);
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        image: 'https://images.unsplash.com/photo-1713190184313-ffd62ed18fd0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        password,
        places: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        console.error('Error during createdUser.save:', err);
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error);
    }
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};


const login = async(req, res,next) => {
    const { email, password } = req.body
    let existingUser;
try{
   existingUser = await User.findOne({email: email})
}catch(err){
    const error = new HttpError("Login failed, please try again", 500)
    return next(error)
}

if(!existingUser || existingUser.password !== password){
    const error = new HttpError("Invalid credentials, could not log you in", 401)
    return next(error)
}

    res.json({ message: 'Logged in!' })
}

exports.getUsers = getUsers
exports.signup = signup
exports.login = login