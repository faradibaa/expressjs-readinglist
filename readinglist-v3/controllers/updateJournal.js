import asyncHandler from 'express-async-handler';
import Journal from "../models/journalModels.js";

const updateJournal = asyncHandler(async (req, res, next) => {
  const { current_page, status } = req.body;

  const updateList = await Journal.update({
    current_page: current_page,
    status: status,
  }, {
    where: {
      id: req.params.bookId,
    }
  });

  const afterUpdate = await Journal.findAll({
    where: {
      id: req.params.bookId,
    }
  })

  console.log(`Update data of the book with ID: ${req.params.bookId}. Result:`, afterUpdate);
  res.status(200).json(afterUpdate);
});

export default updateJournal;