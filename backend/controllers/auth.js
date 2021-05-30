const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const name = req.body.name;
  const password = req.body.password;
  const surname = req.body.surname;
  const address = req.body.address;
  const birthdate = req.body.birthdate
  const expertise = req.body.expertise

  try {
    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      password: hashedPw,
      name: name,
      surname: surname,
      address: address,
      birthdate:birthdate,
      expertise:expertise
    });
    const result = await user.save();
    res.status(201).json({ message: 'User created!', userId: result._id, name:result.name, surname:result.surname, address:result.address });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ name: name });
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        name: loadedUser.name,
        userId: loadedUser._id.toString()
      },
      'somesupersecretsecret',
      { expiresIn: '2h' }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString(),user:loadedUser });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }
    user.status = newStatus;
    await user.save();
    res.status(200).json({ message: 'User updated.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
