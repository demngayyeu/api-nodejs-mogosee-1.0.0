import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

mongoose.set('strictQuery', true);
const UserSchema = new mongoose.Schema(
  {
    emailVerified: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: [true, 'Please add a name']
    },
    picture: {
      type: String,
      default: process.env.DEFAULT_PICTURE
    },
    username: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [/^\S+@\S+$/, 'Please add a valid email']
    },
    role: {
      type: String,
      enum: ['user', 'author', 'admin'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    premium: {
      type: Array,
      default: []
    },
    defaultKey: {
      type: String,
      required: true
    },
    limit: {
      type: Number,
      default: process.env.LIMITCOUNT
    },
    ip: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwt = function () {
  return jwt.sign({ user: this }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

UserSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'user'
});

UserSchema.virtual('post', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'post'
});

export default mongoose.model('User', UserSchema);
