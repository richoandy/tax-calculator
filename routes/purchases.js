var express = require('express');
var router = express.Router();

const purchaseController = require('../controllers').Purchase;

/* GET home page. */
router.get('/', purchaseController.readAll);
router.post('/', purchaseController.create);

module.exports = router;
