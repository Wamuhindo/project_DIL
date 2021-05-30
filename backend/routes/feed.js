const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');
const channelController = require('../controllers/channel');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);


router.get('/channelposts/:channelId', isAuth, channelController.getPostChannels);
router.get('/channels/:userId', isAuth, channelController.getChannels);

// POST /feed/post
router.post(
  '/post',
  isAuth,
  [
    body('message')
      .trim()
      .isLength({ min: 1 })
  ],
  feedController.createPost
);



router.post(
  '/channel',
  isAuth,
  [
    body('name')
      .trim()
      .isLength({ min: 2 })
  ],
  channelController.assignChannel
);


router.post(
  '/comment',
  isAuth,
  [
    body('message')
      .trim()
      .isLength({ min: 1 })
  ],
  feedController.createComment
);


router.delete('/post/:postId', isAuth, feedController.deletePost);


module.exports = router;
