const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TYPES = require('./emotions');
const moment = require('moment');

const JournalSchema = new Schema({
    entry           : { type: String, required: true },
    feeling         : { type: String, enum: TYPES, required: true },
    _creator        : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date            : { type: Date, default: Date.now }
});

JournalSchema.methods.belongsTo = function(user){
    return this._creator.equals(user._id);
  };

JournalSchema.virtual('inputFormattedDate').get(function(){
    return moment(this.date).format("LL");
  });
  

module.exports = mongoose.model('Journal', JournalSchema);