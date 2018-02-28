const Journal = require('../models/journal.js');

function authorizeJournal(req, res, next){
  Journal.findById(req.params.id, (err, journal) => {
    // If there's an error, forward it
    if (err)      { return next(err) }
    // If there is no journal entry, return a 404
    if (!journal){ return next(new Error('404')) }
    // If the journal belongs to the user, next()
    if (journal.belongsTo(req.user)){
        return next()
      } else {
    // Otherwise redirect
        return res.redirect(`/journals/${journal._id}`)
      }
  });
}

module.exports = authorizeJournal;