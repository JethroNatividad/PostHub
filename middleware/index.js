const Post = require("../models/post"),
  Comment = require("../models/comment")
var middleware = {}
//middleware
//check if logged in
middleware.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    req.flash("error", "You need to be logged in to do that")
    res.redirect("/login")
  }
}
middleware.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    //finc comment
    Comment.findById(req.params.commentId, (err, comment) => {
      //check if comment author id matches current user id
      if (req.user._id.equals(comment.author.id)) {
        next()
      } else {
        req.flash("error", "You don't have permission to do that")
        res.redirect("/posts/" + req.params.id)
      }
    })
  } else {
    req.flash("error", "You need to be logged in to do that")
    res.redirect("/login")
  }
}
middleware.checkPostOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    //finc comment
    Post.findById(req.params.id, (err, post) => {
      //check if comment author id matches current user id
      if (req.user._id.equals(post.author.id)) {
        next()
      } else {
        req.flash("error", "You don't have permission to do that")
        res.redirect("/posts/" + req.params.id)
      }
    })
  } else {
    req.flash("error", "You need to be logged in to do that")
    res.redirect("/login")
  }
}
middleware.protectRoute = function(req, res, next){
  if(!req.session.processing){
    req.session.processing = true; // set flag
    req.session.save(()=> next())
   // continue in route chain
  } else {
    res.status(400).send() // end request here with 400 status code, drop everything
  }
}

middleware.unlockRoute = function(req, res, next){
  req.session.processing = false; // unset flag
  req.session.save(()=> next())
};
module.exports = middleware