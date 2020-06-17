const Post             = require("../models/post"),
Comment                = require("../models/comment")
var middleware = {
}
//middleware
//check if logged in
middleware.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) {
        next()
    } else {
        console.log("you need to be logged in")
        req.flash("error", "You need to be logged in to do that")
        res.redirect("/login")
    }
}
module.exports = middleware