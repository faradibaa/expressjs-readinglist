import express from 'express';
import dotenv from 'dotenv';
import readingRouter from './routes/journalRoutes.js';

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/', readingRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});