import asyncHandler from 'express-async-handler';
import Reading from "../models/readingModel.js";

const deleteReadingData = asyncHandler(async (req, res, next) => {
  const deleteBook = await Reading.destroy({
    where: {
      id: req.params.bookId,
    }
  });
  console.log(`Delete data of the book with ID: ${req.params.bookId}. Result: `, deleteBook);
  res.status(200).send(`Delete data of the book with ID: ${req.params.bookId}.`);
});

export default deleteReadingData;