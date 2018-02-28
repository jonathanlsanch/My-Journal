var express = require('express');
var router = express.Router();
const Journal = require('../models/journal');
const { ensureLoggedIn } = require('connect-ensure-login');

/* GET index page. */
router.get('/', ensureLoggedIn('/login'), function(req, res, next) {
  Journal
    // Retrieve all existing journals
    .find({_creator: req.user._id})
    .populate('_creator')
    .exec((err, journals) => {
      res.render('index', { journals });
    });
});




module.exports = router;
