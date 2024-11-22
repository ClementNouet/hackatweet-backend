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
      id: tweet._id
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
  const isLiked = req.body.isLiked;
  if (isLiked) {
    Tweet.updateOne(
      { _id: id, "usersLikes.user": {$ne: userToken}  }, // On vérifie si l'utilisateur a déjà aimé ce tweet
      { 
        $push: { usersLikes: { user: userToken, isLiked: isLiked } }, // Ajoute l'utilisateur dans la liste des likes
        $set: { likes: req.body.likes } // Met à jour le nombre total de likes
      }
    )
    .then(() => res.json({ result: true }))
  }else {
    // Si l'utilisateur ne veut plus aimer le tweet, il faut le retirer de la liste des likes
    Tweet.updateOne(
      { _id: id, "usersLikes.user": userToken }, 
      { 
        $pull: { usersLikes: { user: userToken } }, // Retire l'utilisateur de la liste des likes
        $set: { likes: req.body.likes } // Met à jour le nombre total de likes
      }
    )
    .then(res.json({ result: false}))
  }
})

module.exports = router;
