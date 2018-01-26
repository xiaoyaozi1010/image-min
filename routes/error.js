var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
    res.send({ code: 1, errMsg: '不支持的格式' })
})
module.exports = router;