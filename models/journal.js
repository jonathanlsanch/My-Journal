const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TYPES = require('./emotions');
const moment = require('moment');

const JournalSchema = new Schema({
    entry           : { type: String, required: true },
    feeling         : { type: String, enum: TYPES, required: true },
    _creator        : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date            : { type: Date, required: true }
});

// Date Formatting
JournalSchema.virtual('inputFormattedDate').get(function() {
    return moment(this.date).format('YYYY-MM-DD');
});

JournalSchema.methods.belongsTo = function(user){
    return this._creator.equals(user._id);
  }

module.exports = mongoose.model('Journal', JournalSchema);