import asyncHandler from 'express-async-handler';
import Journal from "../models/journalModels.js";

const getAllJournal = asyncHandler(async (req, res, next) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const offset = (page - 1) * limit;

  // get data based on query parameters; if query param is empty, then it will get all data
  let queryParams = {};

  for(const query in req.query) {
    if(req.query[query] && query!=="page" && query!=="limit") {
      queryParams[query] = req.query[query];
    }
  }

  try {
    const { count, rows } = await Journal.findAndCountAll({
      where: queryParams,
      offset,
      limit,
    });
  
    const journals = { 
      total_data: count,
      last_page: Math.ceil(count/limit),
      current_page: page,
      data_per_page: limit,
      from_data: offset+1,
      to_data: count<(offset+limit) ? count : offset+limit,
      data: rows
    }
  
    // res.status(200).json(journals);
  
    res.render('app', journals); // app.ejs
  }
  catch(err) {
    res.render('error-page', {status_code: 500, message: err});
  }
});

export default getAllJournal;