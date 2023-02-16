import express from 'express';
const router = express.Router();

import {
  getComments,
  getComment,
  addComment,
  updateComment,
  deleteComment
} from '../controller/blog/index.js';

import { authenticate } from '../middleware/index.js';

router.get('/', getComments);
router.get('/:id', getComment);
router.post('/', authenticate, addComment);
router.put('/:id', authenticate, updateComment);
router.delete('/:id', authenticate, deleteComment);

export default router;
