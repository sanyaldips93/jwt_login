const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { body, validationResult } = require('express-validator');

const User = require('../models/User');


// Register Handle
router.post('/register', [ // Validation
    body('name')
      .not().isEmpty()
      .withMessage('Name cannot be empty.'),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be more than 6 chars.')
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(errors.errors.length > 0) return res.status(400).send(errors.errors[0].msg)

    // Check if the user already exists
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists!');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //  Create new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword
    });
    try {
      const savedUser = await user.save();
      res.send(savedUser);
    } catch(e) {
      res.status(400).send(e);
      console.log(e);
    }
})

router.post('/login', [ // Validation
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
    body('password', 'Password has to be more than 6 chars.')
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim()
  ], async (req, res) => {

      // Validate data before database call
      const errors = validationResult(req);
      if(errors.errors.length > 0) return res.status(400).send(errors.errors[0].msg)

      // Check if the user already exists
      const user = await User.findOne({email: req.body.email});
      if(!user) return res.status(400).send('Email is incorrect!');

      // Check if password is correct
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if(!validPass) return res.status(400).send('Password is incorrect!');

      // Create and assign a token
      const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
      res.header('auth-token', token).send(token);
  })

module.exports = router;
