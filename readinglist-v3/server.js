import express from 'express';
import dotenv from 'dotenv';
import readingRouter from './routes/journalRoutes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // views directory's name (./views/)

app.use(express.static(path.join(__dirname, 'public'))); // use CSS styling inside directory './public/`
app.use('/', readingRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});