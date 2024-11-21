var express = require('express');
var router = express.Router();

require('../models/connection');

const User = require('../models/users');
const Tweet = require('../models/tweets');
const Trend = require('../models/trends');

//Recouperer tous les tweets
router.get('/', function(req, res, next) {
  Tweet.find({}).populate('user').then(data => {
    res.json({ content: data.content, createAt: data.createAt, token: data.user.token });
  })
})
//Créer un tweet
router.post('/NewTweet/:token', (req, res) => {
  User.findOne({token: req.params.token}).then(data => {
    const newTweet = new Tweet({
      content: req.body.tweet,
      createAt: new Date,
      user: data._id
    })
    newTweet.save().then(res.json({ result: true }))
  })
}) 
//Effacer un tweet 
router.delete('/:id', function(req, res, next) {
  const id = req.params.id
  Trend.deleteOne({ tweet: id }).then(()=>{
    res.json({ message: "This trend has been deleted."})
})
  Tweet.deleteOne({ _id: id }).then(()=>{
      res.json({ message: "This tweet has been deleted."})
  })
})


module.exports = router;
