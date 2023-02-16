import express from 'express';
const router = express.Router();

import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} from '../controller/blog/index.js';
import { authenticate } from '../middleware/auth.js';

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;
