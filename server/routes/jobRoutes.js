const express = require('express');
const router = express.Router();
const {
  getJobCards,
  startJob,
  stopJob,
  getCompletedJobs,
  getActiveJob 
} = require('../controllers/jobController');

router.get('/jobcards', getJobCards);
router.post('/jobs/start', startJob);
router.post('/jobs/stop', stopJob);
router.get('/jobs/completed', getCompletedJobs);
router.get('/jobs/active', getActiveJob);

module.exports = router;
