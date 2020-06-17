const passport         = require("passport"),
express                = require("express"),
Post                   = require("../models/post"),
User                   = require("../models/user"),
Comment                = require("../models/comment"),
router                 = express.Router()
//landing page
router.get("/", (req, res)=>{
    res.render("landing");
});
//render sign up page
router.get("/signup", (req, res)=>{
    res.render("index/signup")
})
//handle signup logic
router.post("/signup", (req, res)=>{
    var newUser = {
        username: req.body.username
    }
    User.register(newUser, req.body.password, (err, user)=>{
        if (err) {
            console.log(err)
            return res.redirect("/posts")
        }
        passport.authenticate("local")(req, res, ()=>{
            console.log(user)
            res.redirect("/posts")
        })
    })
})
//render login page
router.get("/login", (req, res)=>{
    res.render("index/login")
})
//handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login"
}), (req, res)=>{
})
//logout logic
router.get("/logout", (req, res)=>{
    req.logout()
    res.redirect("/")
})
module.exports = router