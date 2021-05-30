const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    channel:{
      type: Schema.Types.ObjectId,
      ref: 'Channel',

    },
    message: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
     
    },
    tags:[{
      type: Schema.Types.String,
    }],
    replies:[
      {
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }
    ],
    views:{
      type:Schema.Types.Number,
    },
    type:{
      type:Schema.Types.String,
    },
    parentId:{
      type:Schema.Types.ObjectId,
      ref: 'Post',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
