const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const PostSchema = new mongoose.Schema({
    songTitle: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    genre: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

PostSchema.statics.toAPI = (doc) => ({
    songTitle: doc.songTitle,
    genre: doc.genre,
    rating: doc.rating,
    description: doc.description
});

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;