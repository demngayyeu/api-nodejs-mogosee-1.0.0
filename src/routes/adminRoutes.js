import express from 'express';
const router = express.Router();

import { register, login, getUsers } from '../controller/users/UserController.js';
import { authenticate, authorize } from '../middleware/auth.js';

router.get('/users', authenticate, authorize(['admin']), getUsers);
router.post('/register', register);
router.post('/login', login);

export default router;
