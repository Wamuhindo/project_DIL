const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');
const Channel = require('../models/channel');
const mongoose = require('mongoose');

exports.getChannels = async (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId)

  try {
    const user = await User.findById(userId).populate('channels');
    if (!user) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }

  /*   async function getChannel(item, index){
      return await Channel.findById(item)
  }
    const mchannels = await Promise.all(
      user.channels.map(getChannel)
  ); */
    const totalItems = user.channels.length;

    res.status(200).json({
      message: 'Fetched channels successfully.',
      channels: user.channels,
      totalItems: totalItems
    });

  
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPostChannels = async (req, res, next) => {

  const channelId = req.params.channelId;
 
  try {
    const channel = await Channel.findById(channelId)
    .populate([{path:'posts',
              model:'Post',
              match: {
                type: 'parent'
            },options: { 
              sort: { 'createdAt': -1 } 
            },
              populate:[{
                path:'user',
                model:'User'
              },{path:'replies',
              model:'Post',
              populate:{
                path:'user',
                model:'User'
              }
            }]

              },
              {path:'posts.replies',
              model:'Post',
              populate:{
                path:'posts.replies.user',
                model:'User'
              }

              }])
    
    if (!channel) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }

/*     async function getPost(item, index){
      return await Post.findById(item)
  }
    const posts = await Promise.all(
      channel.posts.map(getPost)
  );
    
  async function getReply(item, index){
    const replies = item.replies;
    const repliesComplete = replies.map(getPost)
} */
  console.log(channel.posts)
    res.status(200).json({ message: 'posts fetched.', posts: channel.posts });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};



exports.assignChannel = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

 // const imageUrl = req.file.path;
  const name = req.body.name;
  const image =  req.body.image;
  const channel = new Channel({
    name: name,
    image: image,
    user: req.body.userId,
  });
  try {
    await channel.save();
    const user = await User.findById(req.userId);
    user.channels.push(channel);
    await user.save();
    io.getIO().emit('channels', {
      action: 'assign',
      channel: { ...channel._doc, user: { _id: req.body.userId } }
    });
    res.status(201).json({
      message: 'channel assigned successfully!',
      channel: channel,
      user: { _id: user._id }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};



exports.createChannel = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

 // const imageUrl = req.file.path;
  const name = req.body.name;
  const image =  req.body.image;
  const channel = new Channel({
    name: name,
    image: image,
  });
  try {
    await channel.save();

    io.getIO().emit('channel', {
      action: 'created',
      channel: { ...channel._doc }
    });
    res.status(201).json({
      message: 'channel created successfully!',
      channel: channel,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};