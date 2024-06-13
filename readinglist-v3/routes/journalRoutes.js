import express from 'express';
import getAllJournal from '../controllers/getJournalsController.js';
import getJournalById from '../controllers/getJournalByIdController.js';
import addNewJournal from '../controllers/addNewJournalController.js';
import updateJournal from '../controllers/updateJournalController.js';
import deleteJournal from '../controllers/deleteJournalController.js';

const readingRouter = express.Router();

readingRouter.route('/journals').get(getAllJournal).post(addNewJournal);
readingRouter.route('/journals/:journalId').get(getJournalById).put(updateJournal).delete(deleteJournal);

export default readingRouter;