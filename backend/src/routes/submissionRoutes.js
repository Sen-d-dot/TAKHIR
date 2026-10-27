const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');

router.get('/', submissionController.getSubmissions);
router.post('/', submissionController.createSubmission);
router.patch('/:id/approve', submissionController.approveSubmission);
router.patch('/:id/reject', submissionController.rejectSubmission);
router.delete('/:id', submissionController.deleteSubmission);

module.exports = router;