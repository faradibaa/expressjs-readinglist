import asyncHandler from 'express-async-handler';
import Journal from "../models/journalModels.js";

const getJournalById = asyncHandler(async (req, res, next) => {
  try {
    const bookInfo = await Journal.findAll({
      where: {
        id: req.params.journalId,
      },
    });

    const plainBookInfo = bookInfo.map(book => book.toJSON());
    
    const getJournal = {
      data: plainBookInfo,
    }

    // debugging
    // console.log(`Get data of the book with ID: ${req.params.journalId}`);
    // console.log(`Raw result of query:`);
    // console.dir(bookInfo, {depth: null});
    // console.log(`After convent sequelize instance to plain object:`);
    // console.dir(plainBookInfo, {depth: null});

    // res.status(200).json(getJournal);
    res.render('highlight', getJournal);
  }
  catch(err) {
    res.render('error-page', {status_code: 500, message: err});
  }
});

export default getJournalById;