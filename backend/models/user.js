const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  expertise: {
    type: String,
  },
  birthdate: {
    type: String,
  },
  address:{
    type: String,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  channels: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Channel'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
