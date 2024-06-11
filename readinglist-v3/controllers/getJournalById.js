import asyncHandler from 'express-async-handler';
import Reading from "../models/readingModel.js";

const getReadingData = asyncHandler(async (req, res, next) => {
  const bookInfo = await Reading.findAll({
    where: {
      id: req.params.bookId,
    },
  });
  console.log(`Get data of the book with ID: ${req.params.bookId}. Result: ${bookInfo}`);
  res.status(200).json(bookInfo);
});

export default getReadingData;