const mongoose = require('mongoose');

const trendSchema = mongoose.Schema({
    trend: String,
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'tweets' },
   });
   
   const Trend = mongoose.model('trends', trendSchema);

module.exports = Trend;