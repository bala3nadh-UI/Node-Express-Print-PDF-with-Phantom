var express = require("express"),
    router = express.Router();

router.get('/', function(req, res) {
    //res.send("Hello Express Server");
    res.sendFile('/Users/z1148/Desktop/node/views/index.html');
});

module.exports = router;