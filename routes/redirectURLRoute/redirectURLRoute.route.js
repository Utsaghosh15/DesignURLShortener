const express = require('express');
const { redirectURLController } = require('../../controllers/redirectURLController/redirectURLController.controller');

const router = express.Router();

router.get('/:shortCode', redirectURLController);

module.exports = router;