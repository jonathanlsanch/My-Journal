const express               = require('express');
const Journal               = require('../models/journal');
const TYPES                 = require('../models/emotions');
const router                = express.Router();
const { ensureLoggedIn }    = require('connect-ensure-login');
// const {
//     authorizeJournal,
//     checkOwnership
//   } = require('../middleware/journal-authorization');

// Display Form to Create Journal
router.get('/new', (req, res) => {
    res.render('journals/new', { types: TYPES });
});

// Handle Create Journal Form Submission
router.post('/', ensureLoggedIn('/login'), (req, res, next) => {
    const newJournal = new Journal({
        entry: req.body.entry,
        feeling: req.body.feeling,
        date: req.body.date,

        // This will throw an error is there's no
        // User to associate the journal with
        _creator: req.user._id
    });

    newJournal.save((err) => {
        if (err) {
            res.render('journals/new', { journal: newJournal, types: TYPES });
        } else {
            res.redirect(`/journals/${newJournal._id}`);
        }
    }); 
});

// Show Individual Routes
router.get('/:id', (req, res, next) => {
    Journal.findById(req.params.id, (err, journal) => {
        if (err) { return next(err) }

        journal.populate('_creator', (err, journal) => {
            if (err) { return next(err) }
            return res.render('journals/show', { journal });
        });
    });
});

// Delete

router.post('/:id/delete', (req, res, next) => {
    const id = req.params.id;
  
    Journal.findByIdAndRemove(id, (err, product) => {
      if (err){ return next(err); }
      return res.redirect('/index');
    });
  
  });


// Display Edit Journal Form
router.get('/:id/edit', 
    ensureLoggedIn('/login'),
    (req, res, next) => {
    Journal.findById(req.params.id, (err, journal) => {
        if (err)        { return next(err) }
        if (!journal)  { return next(new Error("404")) }
        return res.render('journals/edit', { journal, types: TYPES })
    });
});

// Handle Edit Journal Form Submission
router.post('/:id',
    ensureLoggedIn('/login'),
    (req, res, next) => {
    const updates = {
        entry: req.body.entry,
        feeling: req.body.feeling,
        // date: req.body.date
    };

    Journal.findByIdAndUpdate(req.params.id, updates, (err, journal) => {
        if (err) {
            return res.render('journals/edit', {
                journal,
                errors: journal.errors
            });
        }
        if (!journal) {
            return next(new Error('404'));
        }
        return res.redirect(`/journals/${journal._id}`);
    });
});

module.exports = router;