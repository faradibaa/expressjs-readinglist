import asyncHandler from 'express-async-handler';
import Journal from "../models/journalModels.js";

const deleteJournal = asyncHandler(async (req, res, next) => {
  try {
    const deleteBook = await Journal.destroy({
      where: {
        id: req.params.journalId,
      }
    });
    console.log(`Delete data of the book with ID: ${req.params.journalId}. Result: `, deleteBook);
    res.status(200).send(`Delete data of the book with ID: ${req.params.journalId}.`);
  }
  catch(err) {
    res.render('error-page', {status_code: 500, message: err});
  }
});

export default deleteJournal;