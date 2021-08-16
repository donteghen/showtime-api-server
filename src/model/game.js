const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title:{
        type : String,
        required: [true, 'Title is required, please add a title'],
        trim : true
    },
    description : {
        type : String,
        required: [true, 'Description is required, please add a short description'],
        trim : true
    },
    thumbnail:{
        type : String,
        required: [true, 'please a thumbnail'],
    },
    thumbnailDeleteId : {
        type : String,
        required: [true, 'please a thumbnail'],
    },
    github_link : {
        type : String,
        required: [true, 'please enter a project source link']
    }
});

const Game = mongoose.model('Game', gameSchema)
module.exports = Game;