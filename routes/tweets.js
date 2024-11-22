var express = require('express');
var router = express.Router();

const User = require('../models/users');
const Tweet = require('../models/tweets');
const Trend = require('../models/trends');

//Recouperer tous les tweets
router.get('/', function(req, res, next) {
  Tweet.find({}).populate('user').then(data => {
    const formattedData = data.map(tweet => ({
      content: tweet.content,
      createAt: tweet.createAt,
      token: tweet.user.token,
      username: tweet.user.username, 
      likes: tweet.likes,
      id: tweet._id,
      usersLikes: tweet.usersLikes
    }));
    res.json(formattedData);
  })
})

//Créer un tweet
router.post('/NewTweet/:token', (req, res) => {
  User.findOne({token: req.params.token}).then(data => {
    const newTweet = new Tweet({
      content: req.body.tweet,
      createAt: new Date,
      user: data._id, 
      likes: 0, 
      usersLikes: []
    })
    newTweet.save().then(res.json({ result: true }))
  })
}) 
//Effacer un tweet 
router.delete('/:id', function(req, res, next) {
  const id = req.params.id
  Trend.deleteOne({ tweet: id })
  Tweet.deleteOne({ _id: id }).then(()=>{
      res.json({ message: "This tweet has been deleted."})
  })
})
//Ajouter des likes
router.put('/:id', function(req, res, next) {
  const id = req.params.id
  const userToken = req.body.token;

  Tweet
    .findById(id)
    .then((tweet) => {
      if (tweet.usersLikes.includes(userToken)) {
        Tweet
          .findByIdAndUpdate(id, { $pull: { usersLikes: userToken }, $set: { likes: tweet.likes > 0 ? tweet.likes - 1 : 0 } })
          .exec()
          .then(() => res.json({ result: false }))
      } else {
        Tweet
          .findByIdAndUpdate(id, { $addToSet: { usersLikes: userToken }, $set: { likes: tweet.likes + 1 } })
          .exec()
          .then(() => res.json({ result: true }))
      }
    })
})

module.exports = router;
