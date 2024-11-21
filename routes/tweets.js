var express = require('express');
var router = express.Router();

require('../models/connection');

const User = require('../models/users');
const Tweet = require('../models/tweets');

router.post('/newTweet/:token', (req, res) => {

    // Trouver l'utilisateur par son token depuis les paramètres d'URL
    User.findOne({ token: req.params.token }).then(user => {
      if (!user) {
        res.json({ result: false, error: 'User not found' });
        return;
      }

    const newTweet = new Tweet({
      content: req.body.content, 
      createAt: new Date,
      users: user._id 
    });

    newTweet.save().then(tweet => {
      res.json({ result: true, tweet });
    })
  })
});

// Route DELETE qui permet de supprimer le voyage concerné et de renvoyer les voyage contenu dans le cart
router.delete("/:id", (req, res) => {
    Tweet.deleteOne({ _id: req.params.id }).then((deleteTweet) => {
      if (deleteTweet.deletedCount > 0) {
        Tweet.find().then((data) => res.json({ result: true, tweet: data }));
        console.log("Tweet successfully deleted");
      } else {
        res.json({ result: false, error: "No tweet deleted" });
      }
    });
  });


module.exports = router;
