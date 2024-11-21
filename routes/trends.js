var express = require('express');
var router = express.Router();

require('../models/connection');

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
    Tweet.findOne({ content: { $regex: new RegExp(req.body.trend, 'g') } }).then(data => {
        const newTrend = new Trend({
        trend: req.body.trend,
        tweet: data._id
        })
        newTrend.save().then(res.json({ result: true }))
    })
}) 
//Effacer un tweet 
router.delete('/:id', function(req, res, next) {
  const id = req.params.id
  Tweet.deleteOne({ _id: id }).then(()=>{
      res.json({ message: "This tweet has been deleted."})
  })
})


module.exports = router;
