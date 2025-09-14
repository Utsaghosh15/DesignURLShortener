const express = require('express');
const validator = require('validator');
const { createURLController } = require('../../controllers/createURLController/createURLController.controller');

const router = express.Router();


router.post('/', createURLController);

module.exports = router;