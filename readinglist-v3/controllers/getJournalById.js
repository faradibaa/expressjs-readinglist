import asyncHandler from 'express-async-handler';
import Journal from "../models/journalModels.js";

const getJournalById = asyncHandler(async (req, res, next) => {
  const bookInfo = await Journal.findAll({
    where: {
      id: req.params.bookId,
    },
  });
  console.log(`Get data of the book with ID: ${req.params.bookId}. Result: ${bookInfo}`);
  res.status(200).json(bookInfo);
});

export default getJournalById;