var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({"MSG":"HELLO"})
});


router.use('/users', require('../models/users/users.controller'));

module.exports = router;