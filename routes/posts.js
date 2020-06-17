const express          = require("express"),
Post                   = require("../models/post"),
middleware             = require("../middleware/index"),
Comment                = require("../models/comment"),
router                 = express.Router()

//posts index
router.get("/", (req, res)=>{
    Post.find({}, (err, data)=>{
        if (err) {
            console.log(error)
            return res.redirect("/")
        } else {
            res.render("posts/index", {posts: data, page: "posts"});
        }
    });    
});
//post new
//show form
router.get("/new",middleware.isLoggedIn, (req, res)=>{
    res.render("posts/new", {page: "create"})
});
//post create
//handle create post logic
router.post("/",middleware.isLoggedIn, (req, res)=>{
    req.body.post.author = {
      username: req.user.username,
      id: req.user._id
    }
    Post.create(req.body.post, (err)=>{
        if (err) {
            console.log(error)
            return res.redirect("/")
        } else {
            res.redirect("/posts"); 
        }
    })
})
//post show
//render show page
router.get("/:id", (req, res)=>{
    Post.findById(req.params.id).populate("comments").exec((err, data)=>{
        if (err) {
            console.log(error)
            return res.redirect("/")
        } else {
            res.render("posts/show", {post: data});
        }
    })
})
//edit route
//show edit form
router.get("/:id/edit", (req, res)=>{
  Post.findById(req.params.id, (err, data)=>{
    if (err) {
      console.log(error)
      return res.redirect("/")
    }
    res.render("posts/edit", {post: data})
  })
})
//Update route
//handle update logic
router.put("/:id", (req, res)=>{
  Post.findByIdAndUpdate(req.params.id, req.body.post, (err, data)=>{
    if (err) {
      console.log(error)
      return res.redirect("/")
    }
    res.redirect("/posts/"+ req.params.id)
  })
})
//Destroy route
//handle deleting post logic
router.delete("/:id", (req, res)=>{
  Post.findByIdAndRemove(req.params.id, (err, data)=>{
    if (err) {
      console.log(error)
      return res.redirect("/")
    }
    Comment.deleteMany({_id: {
      $in: data.comments
    }})
    res.redirect("/posts")
  })
})
module.exports = router;