const passport = require("passport"),
  express = require("express"),
  Post = require("../models/post"),
  User = require("../models/user"),
  Comment = require("../models/comment"),
  router = express.Router()
//landing page
router.get("/", (req, res) => {
  if (req.user) {
    return res.redirect("/posts")
  }
  res.render("landing");
});
//render sign up page
router.get("/signup", (req, res) => {
  if (req.user) {
    return res.redirect("/posts")
  }
  res.render("index/signup", {
    page: "signup"
  })
})
//handle signup logic
router.post("/signup", (req, res) => {
  var newUser = {
    username: req.body.username
  }
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err)
      req.flash("error", err.message)
      return res.redirect("/signup")
    }
    passport.authenticate("local")(req, res, () => {
      console.log(user)
      req.flash("success", "Welcome to posthub, " + req.user.username)
      res.redirect("/posts")
    })
  })
})
//render login page
router.get("/login", (req, res) => {
  if (req.user) {
    return res.redirect("/posts")
  }
  res.render("index/login", {
    page: "login"
  })
})
//handle login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/posts",
  failureRedirect: "/login",
  failureFlash: true,
  successFlash: "Welcome back"
}), (req, res) => {})
//logout logic
router.get("/logout", (req, res) => {
  req.logout()
  req.flash("success", "Sucessfully logged out")
  res.redirect("/posts")
})
//user profile
router.get("/users/:id", (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      console.log(err)
      req.flash("Error", "User not found")
      return res.redirect("/posts")
    }
    Post.find().where("author.id").equals(user._id).exec((err, posts) => {
      res.render("index/profile", {
        user: user,
        posts: posts
      })
    })
  })
})
router.get("*", (req, res) => {
  res.render("index/404");
});
module.exports = router