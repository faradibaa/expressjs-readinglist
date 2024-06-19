import asyncHandler from 'express-async-handler';
import Journal from "../models/journalModels.js";

const updateJournal = asyncHandler(async (req, res, next) => {
  const { current_page, status } = req.body;

  try {
    const updateList = await Journal.update({
      current_page: current_page,
      status: status,
    }, {
      where: {
        id: req.params.journalId,
      }
    });
  
    const afterUpdate = await Journal.findAll({
      where: {
        id: req.params.journalId,
      }
    })
  
    console.log(`Update data of the book with ID: ${req.params.journalId}. Result:`, afterUpdate);
    res.status(200).json(afterUpdate);
  }
  catch(err) {
    res.render('error-page', {status_code: 500, message: err});
  }
});

export default updateJournal;