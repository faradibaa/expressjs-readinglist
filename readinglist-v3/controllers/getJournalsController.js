import asyncHandler from 'express-async-handler';
import Journal from "../models/journalModels.js";

const getAllJournal = asyncHandler(async (req, res, next) => {
  console.log(req.query);
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const offset = (page - 1) * limit;

  // get data based on query parameters; if query param is empty, then it will get all data
  let queryParams = {};
  for(const query in req.query) {
    if(req.query[query] && !req.query.page && !req.query.limit) {
      queryParams[query] = req.query[query];
    }
  }

  const { count, rows } = await Journal.findAndCountAll({
    where: queryParams,
    limit,
    offset,
  });

  res.status(200).json({ 
    total_data: count,
    page,
    from_data: offset+1,
    to_data: count<(offset+limit) ? count : offset+limit,
    data: rows
  });
});

export default getAllJournal;