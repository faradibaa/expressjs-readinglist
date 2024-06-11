import asyncHandler from 'express-async-handler';
import Reading from "../models/readingModel.js";

const updateReadingData = asyncHandler(async (req, res, next) => {
  const { current_page, status } = req.body;

  const updateList = await Reading.update({
    current_page: current_page,
    status: status,
  }, {
    where: {
      id: req.params.bookId,
    }
  });

  const afterUpdate = await Reading.findAll({
    where: {
      id: req.params.bookId,
    }
  })

  console.log(`Update data of the book with ID: ${req.params.bookId}. Result:`, afterUpdate);
  res.status(200).json(afterUpdate);
});

export default updateReadingData;