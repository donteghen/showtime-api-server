const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    gameId:{
        type : String,
        required: true,
    },
    content : {
        type : String,
        required: true,
        trim : true
    },
    authorId:{
        type : mongoose.SchemaTypes.ObjectId,
        required: true,
    }
}, {
    timestamps:true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});
commentSchema.virtual('author', {
    ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true,
})


const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment;