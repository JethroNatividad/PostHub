const express          = require("express"),
Post                   = require("../models/post"),
Comment                = require("../models/comment"),
router                 = express.Router()
//landing page
router.get("/", (req, res)=>{
    res.render("landing");
});
module.exports = router