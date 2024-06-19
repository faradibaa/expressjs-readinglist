import asyncHandler from 'express-async-handler';
import Journal from "../models/journalModels.js";

const getJournalById = asyncHandler(async (req, res, next) => {
  try {
    const bookInfo = await Journal.findAll({
      where: {
        id: req.params.journalId,
      },
    });
    console.log(`Get data of the book with ID: ${req.params.journalId}. Result: ${bookInfo}`);
  
    res.render('highlight', {data: bookInfo});
  }
  catch(err) {
    res.render('error-page', {status_code: 500, message: err});
  }
});

export default getJournalById;