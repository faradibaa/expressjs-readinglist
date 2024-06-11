import express from 'express';
import getAllReadingList from '../controllers/getJournalsController.js';
import getReadingData from '../controllers/getJournalById.js';
import addNewReadingData from '../controllers/addNewJournal.js';
import updateReadingData from '../controllers/updateJournal.js';
import deleteReadingData from '../controllers/deleteJournal.js';

const readingRouter = express.Router();

readingRouter.route('/journals').get(getAllReadingList).post(addNewReadingData);
readingRouter.route('/journals/:bookId').get(getReadingData).put(updateReadingData).delete(deleteReadingData);

export default readingRouter;