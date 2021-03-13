var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    res.send([
        ["Dakota Rice", "Niger", "Oud-Turnhout", "$36,738"],
        ["Minerva Hooper", "Curaçao", "Sinaai-Waas", "$23,789"],
        ["Sage Rodriguez", "Netherlands", "Baileux", "$56,142"],
        ["Philip Chaney", "Korea, South", "Overland Park", "$38,735"],
        ["Doris Greene", "Malawi", "Feldkirchen in Kärnten", "$63,542"],
        ["Mason Porter", "Chile", "Gloucester", "$78,615"]
      ]);
});

module.exports = router;