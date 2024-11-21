const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    content: String,
    createAt: Date,
    users: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
   });
   
   const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;