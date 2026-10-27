const express = require('express');
const router = express.Router();


const { getCompanies, createCompany, deleteCompany } = require('../controllers/companyController');

router.get('/', getCompanies);
router.post('/', createCompany);
router.delete('/:id', deleteCompany);

module.exports = router;