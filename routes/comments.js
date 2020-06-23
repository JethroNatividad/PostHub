const express = require("express"),
  Post = require("../models/post"),
  middleware = require("../middleware/index"),
  Comment = require("../models/comment"),
  router = express.Router({
    mergeParams: true
  })

//Create route
//create comment and push to post
router.post('/', middleware.isLoggedIn, (req, res) => {
  //create comment
  req.body.comment.author = {
    username: req.user.username,
    id: req.user._id
  }
  Comment.create(req.body.comment, (err, comment) => {
    if (err) {
      console.log(error)
      return res.redirect("/")
    }
    //find post
    Post.findById(req.params.id, (err, post) => {
      //push comment to post
      post.comments.push(comment)
      post.save((err) => {
        if (err) {
          console.log(error)
          return res.redirect("/")
        }
        //redirect somewhere
        res.redirect("/posts/" + req.params.id)
      })
    })
  })
})
//Edit route
//render edit
router.get("/:commentId/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.commentId, (err, comment) => {
    if (err) {
      console.log(error)
      return res.redirect("/")
    }
    res.render("comments/edit", {
      comment: comment,
      postId: req.params.id
    })
  })
})
//update route
//handle update logic
router.put("/:commentId", middleware.checkCommentOwnership, (req, res) => {
  //find comment and update
  Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err) => {
    if (err) {
      console.log(error)
      return res.redirect("/")
    }
    //redirect somewhere
    res.redirect("/posts/" + req.params.id)
  })
})
//Destroy route
//handle destroy comment
router.delete("/:commentId", middleware.checkCommentOwnership, (req, res) => {
  //find comment and delete
  Comment.findByIdAndRemove(req.params.commentId, (err) => {
    if (err) {
      console.log(error)
      return res.redirect("/")
    }
    //redirect somewhere
    res.redirect("/posts/" + req.params.id)
  })
})
module.exports = router