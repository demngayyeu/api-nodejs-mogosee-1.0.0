import ip from 'ip';
import User from '../../models/User.js';
import { tryCatch,randomText } from '../../utils/index.js';

const getUsers = tryCatch(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ users });
});

const register = tryCatch(async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    emailVerified: false,
    name,
    username: '',
    email,
    picture: process.env.DEFAULT_PICTURE,
    password,
    role,
    premium: [],
    defaultKey: randomText(8),
    limit: process.env.APIKEY_LIMIT,
    ip: ip.address()
  });

  const token = user.getSignedJwt();

  res.status(201).json({
    success: true,
    token,
    user
  });
});

const login = tryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next({
      message: 'Please provide valid email and password.'
    });
  }

  const user = await User.findOne({ email }).select('+password');
  console.log(user);
  

  if (!user) {
    return next({
      message: 'Invalid Credentials'
    });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next({
      message: 'Invalid Credentials'
    });
  }

  const token = user.getSignedJwt();

  res.status(201).json({
    success: true,
    token,
    userId: user._id
  });
});

export { getUsers, register, login };