var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicineSchema = new Schema({
  userId : String,
  yakname: String,
  hour: Number,
  minute: Number,
  ampm: String,
  selected : Boolean
});

module.export = mongoose.model('medicine',medicineSchema);
