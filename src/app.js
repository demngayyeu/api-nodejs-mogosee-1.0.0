import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';

import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';
import { notFound, errorHandler } from './middleware/middlewares.js';

import swaggerUi from 'swagger-ui-express';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerDocument = require("./swagger.json");
import { ErrorResponse } from './middleware/ErrorResponse.js';

dotenv.config();

const port = process.env.PORT || 4000;

const startServer = async () => {
  const app = express();

  await mongoose.connect(process.env.MONGO_URI);

  app.use(morgan('dev'));
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get('/', (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'Hello World'
    });
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(ErrorResponse);
  app.use('/user', userRoutes);
  app.use('/admin', adminRoutes);
  app.use('/posts', postsRoutes);
  app.use('/comments', commentsRoutes);

  app.listen({ port }, () =>
    console.log(`🚀 Server ready at http://localhost:${port}`)
  );

  app.use(notFound);
  app.use(errorHandler);
};

startServer();