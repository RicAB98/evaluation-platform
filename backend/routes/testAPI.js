var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    res.send([
        ["Dakota Rice", "Niger"],
        ["Minerva Hoper", "Curaçao"],
        ["Sage Rodriguez", "Netherlands"],
        ["Philip Chaney", "Korea, South"],
        ["Doris Greene", "Malawi"],
        ["Mason Porter", "Chile"]
      ]);
});

module.exports = router;