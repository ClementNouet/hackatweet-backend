var express = require('express');
var router = express.Router();

const Tweet = require('../models/tweets');
const Trend = require('../models/trends');

//Recouperer tous les trends
router.get('/', function(req, res, next) {
  Trend.find({}).populate('tweet').then(data => {
    const formattedData = data.map(trend => ({
        trend: trend.trend, 
        tweet: trend.tweet,
      }));
    res.json(formattedData);
  })
})
//Créer un trend
router.post('/NewTrend', (req, res) => {
    Tweet.findOne({ content: { $regex: new RegExp(req.body.trend, 'g') } })
    .then(data => {
        const newTrend = new Trend({
        trend: req.body.trend,
        tweet: data._id
        })
        newTrend.save().then(res.json({ result: true }))
    })
}) 


module.exports = router;
