import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const router = express.Router();

const port = process.env.PORT || 5000;

app.use(express.json());

const dummyFunction = (req, res, next) => {
  console.log("This is dummy function");
  next();
}

router.use((req, res, next) => {
  console.log("gate");
  next();
});

router.param('id', (req, res, next, id) => {
  console.log(`The id you are finding is ${req.params.id}`);
  res.status(200).json({ message: "catch parameters of the request" });
});

app.use('/', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});