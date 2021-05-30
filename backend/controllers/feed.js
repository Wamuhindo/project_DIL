const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');
const Channel = require('../models/channel');
const mongoose  = require('mongoose');

exports.getPosts = async (req, res, next) => {

  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate('user')
      .sort({ createdAt: -1 })

    res.status(200).json({
      message: 'Fetched posts successfully.',
      posts: posts,
      totalItems: totalItems
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

 // const imageUrl = req.file.path;
  const message = req.body.message;
  
  console.log("message: ",message)
  console.log("mchannel: ",req.body.channel)
  console.log("user: ",req.body.user)
  const post = new Post({
    message: message, 
    user: req.body.user,
    channel: req.body.channel,
    views:0,
    tags:['normal','fever'],
    type:req.body.type,
    parentId:req.body.parentId

  });
  try {
    
    await post.save();
    const user = await User.findById(req.body.user);
    user.posts.push(post);
    await user.save();
    const channel= await Channel.findById(req.body.channel);
    channel.posts.push(post)
    await channel.save();
    io.getIO().emit('posts', {
      action: 'create',
      post: { ...post._doc, user: { _id: req.body.user, name: user.name,surname:user.surname,address:user.address } }
    });
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      user: { _id: user._id, name: user.name,surname:user.surname,address:user.address  }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.createComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

 // const imageUrl = req.file.path;
  const message = req.body.message;
  console.log("message: ",message)
  console.log("mchannel: ",req.body.channel)
  console.log("user: ",req.body.user)
  console.log("parentID: ",req.body.parentId)
  const post = new Post({
    message: message,
    user: req.body.user,
    channel: req.body.channel,
    views:0,
    type:req.body.type,
    parentId:req.body.parentId

  });
  try {
    await post.save();
    const postParent = await Post.findById(req.body.parentId);
    postParent.replies.push(post);
    await postParent.save();
    const channel = await Channel.findById(req.body.channel)
    .populate(
      {
        path:'posts',
        model:'Post',
        match: {
          _id: mongoose.Types.ObjectId(req.body.parentId) 
      }

    });
    channel.posts[0].replies.push(post);
    await channel.save()
    const user = await User.findById(req.body.user);
 /*   user.posts.map((_post)=>{
      if(_post._id === req.body.parentId) _post.replies.push(post);
    })
    await user.save();  */
/*     const channel = await Channel.findById(req.body.channelId);
    channel.posts.map((_post)=>{
      if(_post._id === req.body.parentId) _post.replies.push(post);
    }) */
    io.getIO().emit('posts', {
      action: 'createReply',
      post: { ...post._doc, user: { _id: req.body.user, name: user.name,surname:user.surname,address:user.address,expertise:user.expertise } }
    });
    res.status(201).json({
      message: 'reply created successfully!',
      post: post,
      user: { _id: user._id, name: user.name,surname:user.surname,address:user.address  }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};



exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  try {
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Post fetched.', post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;

  try {
    const post = await Post.findById(postId).populate('creator');
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();
    io.getIO().emit('posts', { action: 'update', post: result });
    res.status(200).json({ message: 'Post updated!', post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.body.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    // Check logged in user
    
    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.body.userId);
    user.posts.pull(postId);
    await user.save();
    io.getIO().emit('posts', { action: 'delete', post: postId });
    res.status(200).json({ message: 'Deleted post.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
