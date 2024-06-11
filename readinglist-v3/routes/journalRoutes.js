import express from 'express';
import getAllJournal from '../controllers/getJournalsController.js';
import getJournalById from '../controllers/getJournalById.js';
import addNewJournal from '../controllers/addNewJournal.js';
import updateJournal from '../controllers/updateJournal.js';
import deleteJournal from '../controllers/deleteJournal.js';

const readingRouter = express.Router();

readingRouter.route('/journals').get(getAllJournal).post(addNewJournal);
readingRouter.route('/journals/:bookId').get(getJournalById).put(updateJournal).delete(deleteJournal);

export default readingRouter;