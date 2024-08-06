const uuid = require('uuid')
const { validationResult } = require('express-validator')
const HttpError = require('../models/http-error')
const Place = require('../models/place')
const User = require('../models/user')
const mongoose = require('mongoose')
// let DUMMY_PLACES = [{
//     id: 'p1',
//     title: 'Empire State Building',
//     description: 'One of the most famous sky scrapers in the world!',
//     address: '20 W 34th St, New York, NY 10118, United States',
//     location: {
//         lat: 40.7484405,
//         lng: -73.9878531
//     },
//     creator: 'u1'
// }
// ]


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
   
    const { title, description, address, creator } = req.body
    const createdPlace = new Place({
        title,
        description,
        address,
        image: 'https://images.unsplash.com/photo-1622616234995-072f0e880b81?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        creator,
    })

    let user;
    try{
        user = await User.findById(creator)
    }catch(err){
        const error = new HttpError("Creating place failed, please try again", 500)
        return next(error)
    }

    if(!user){
        const error = new HttpError("Could not find user by the provide id", 404)
        return next(error)
    }
    console.log(user)
    // console.log(createdPlace)
    // const createdPlace = {
    //     id: uuid.v4(),
    //     title,
    //     description,
    //     location: coordinates,
    //     address,
    //     creator,
    // }
    // DUMMY_PLACES.push(createdPlace)
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
    // const updatedPlace = {...DUMMY_PLACES.find(p =>  p.id === placeId )}
    // const placeIndex = DUMMY_PLACES.findIndex(p =>  p.id === placeId )
    let place;
    try{
        place = await Place.findById(placeId)
    }catch(err){
        const error = new HttpError('Something went wrong , could not update place',
        500)
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

    // updatedPlace.title = title
    // updatedPlace.description = description
    // DUMMY_PLACES[placeIndex] = updatedPlace
    // res.status(201).json({ place: updatedPlace })

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

    // if(!DUMMY_PLACES.find(p =>  p.id === placeId )){
    //     throw new HttpError('Could not find a place for that id.', 404)
    // }
    // DUMMY_PLACES = DUMMY_PLACES.filter(p =>  p.id !== placeId )
    res.status(200).json({ message: 'Place Deleted.' })
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace