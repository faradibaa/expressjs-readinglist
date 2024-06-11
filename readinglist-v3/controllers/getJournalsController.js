import asyncHandler from 'express-async-handler';
import Reading from "../models/readingModel.js";

const getAllReadingList = asyncHandler(async (req, res, next) => {
  let listOfAll = {};
  let queryParams = {};

  if(Object.keys(req.query).length) {
    for(const query in req.query) {
      if(req.query[query]) {
        queryParams[query] = req.query[query];
      }
    }
    console.log(queryParams);
    listOfAll = await Reading.findAll({
      where: queryParams
    });
  }
  else {
    listOfAll = await Reading.findAll();
  }
  res.status(200).json(listOfAll);
})

export default getAllReadingList;