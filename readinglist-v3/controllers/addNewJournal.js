import asyncHandler from 'express-async-handler';
import Journal from "../models/journalModels.js";

const addNewJournal = asyncHandler(async (req, res, next) => {
  const { title, author, publisher, total_page, current_page, status } = req.body

  try {
    const book = await Journal.create({
      title: title,
      author: author,
      publisher: publisher,
      total_page: total_page,
      current_page: current_page,
      status: status
    });
    console.log("Add new data to the list.");
  }
  catch(err) {
    console.log("Failed to create new data", err);
  }

  res.status(200).send("Add new data to the list.");
});

export default addNewJournal;