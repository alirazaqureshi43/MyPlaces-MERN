const fs = require('fs')
const uuid = require('uuid')
const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')
const Place = require('../models/place')
const User = require('../models/user')
const mongoose = require('mongoose')

const getPlaceById =  async (req, res, next) => {
    const placeId = req.params.pid 
    let place;
    try{
        place = await Place.findById(placeId)
    }catch(err){
        const error = new HttpError('Something went wrong , could not find',
        500)
        return next(error)
    }
    // const place = DUMMY_PLACES.find(p => { return p.id === placeId })
    if(!place){
        const error = new HttpError('Could not find a place for the provided id.',
        404)
        return next(error)
    }
    // res.json({ place: place } , 200)

    res.json({ place: place.toObject({getters: true}) })

}


const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid
    // const places = DUMMY_PLACES.filter(p => { return p.creator === userId })
    let places;
    try{
        places = await Place.find({creator: userId})
    }catch(err){
        const error = new HttpError('Something went wrong , could not find',
        500)
        return next(error)
    }

    if(!places || places.length === 0){
        const error = new HttpError('Could not find places for the provided user id.', 404) 
        return next(error)
    // throw new HttpError('Could not find places for the provided user id.', 404)    
    }
    res.json({ places: places.map(place => place.toObject({getters: true})) }) 
}

const createPlace = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data.', 422)
    }
   
    const { title, description, address } = req.body
    const createdPlace = new Place({
        title,
        description,
        address,
        image:  req.file.path,
        creator: req.userData.userId
    })

    let user;
    try{
        user = await User.findById(req.userData.userId)
    }catch(err){
        const error = new HttpError("Creating place failed, please try again", 500)
        return next(error)
    }

    if(!user){
        const error = new HttpError("Could not find user by the provide id", 404)
        return next(error)
    }
    try{
        // await createdPlace.save()
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdPlace.save({session: sess})
        user.places.push(createdPlace)
        await user.save({session: sess})
        await sess.commitTransaction()
    }catch(err){
        const error = new HttpError('Creating place failed, please try again',
        500)
        return next(error)
    }
    
    res.status(201).json({ place: createdPlace })
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data.', 422)
    }
    const placeId = req.params.pid
    let place;
    try{
        place = await Place.findById(placeId)
    }catch(err){
        const error = new HttpError('Something went wrong , could not update place',
        500)
        return next(error)
    }

    if(place.creator.toString() !== req.userData.userId){
        const error = new HttpError('You are not allowed!',
        401)
        return next(error)
    }

    const { title, description} = req.body;
    place.title = title
    place.description = description
    
    try{
        await place.save()
    }catch(err){
        const error = new HttpError('Something went wrong , could not update place',
        500)
        return next(error)
    }

    res.status(200).json({ place: place.toObject({getters: true}) })
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid
    let place;
    try{
        place = await Place.findById(placeId).populate('creator')
    }catch(err){
        const error = new HttpError('Something went wrong , could not delete place',
        500)
        return next(error)
    }

    if(!place){
        const error = new HttpError('Could not find the place with provided id', 404)
        return next(error)
    }
    if(place.creator.id !== req.userData.userId){
        const error = new HttpError('You are not allowed to delete!',
        401)
        return next(error)
    }


    const imagePath = place.image
    try{
        const sess = await mongoose.startSession()
        sess.startTransaction()
       await place.deleteOne({session: sess})
       place.creator.places.pull(place)
       await place.creator.save({session: sess})
       await sess.commitTransaction()
    }catch(err){
        const error = new HttpError('Something went wrong , could not delete place',
        500)
        return next(error)
    }

    fs.unlink(imagePath, err=>{
        console.log(err)
    })

    res.status(200).json({ message: 'Place Deleted.' })
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace