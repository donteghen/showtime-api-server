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
    youtubeId: {
        type : String,
        required: [true, 'please enter a youtube id']
    },
    category : {
        tournament : {
            name : {
                type : String,
                required : [true, 'please enter a tounament name']
            }, 
            specific_name : {
                type : String,
                required : [true, 'please specify the tournament']
            }
        }
    },
    game_date : {
        type : String,
        trim : true
    },
    duration: {
        type: String,
        required: [true, 'Please enter the game highlight duration']
    },
    homeTeam : {
        name : {
            type : String,
            required : [true, 'please enter the home teams name']
        },
        goals : {
            type : Number,
            required : [true, 'please enter the home teams total goals']
        }
    },
    awayTeam : {
        name : {
            type : String,
            required : [true, 'please enter the away teams name']
        },
        goals : {
            type : Number,
            required : [true, 'please enter he away teams total goals']
        }
    },
    likes : {
        type : Number,
        default : 0
    }
});

const Game = mongoose.model('Game', gameSchema)
module.exports = Game;