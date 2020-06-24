const express = require("express"),
  Post = require("../models/post"),
  middleware = require("../middleware/index"),
  Comment = require("../models/comment"),
  router = express.Router()
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
var upload = multer({
  storage: storage,
  fileFilter: imageFilter
})
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'jethrosama',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//posts index
router.get("/", (req, res) => {
  Post.find({}, (err, data) => {
    if (err) {
      console.log(error)
      req.flash("Error", "Something went wrong")
      return res.redirect("/posts")
    } else {
      res.render("posts/index", {
        posts: data,
        page: "posts"
      });
    }
  });
});
//post new
//show form
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("posts/new", {
    page: "create"
  })
});
//post create
//handle create post logic
router.post("/", middleware.isLoggedIn, upload.single('image'), (req, res) => {
  cloudinary.uploader.upload(req.file.path, function (result) {
    // add cloudinary url for the image to the campground object under image property
    req.body.post.image = result.secure_url;
    req.body.post.imageId = result.public_id;
    // add author to campground
    req.body.post.author = {
      username: req.user.username,
      id: req.user._id
    }
    Post.create(req.body.post, (err) => {
      if (err) {
        console.log(err)
        req.flash("Error", "Something went wrong")
        return res.redirect("/posts")
      } else {
        res.redirect("/posts");
      }
    })
  })
})
//post show
//render show page
router.get("/:id", (req, res) => {
  Post.findById(req.params.id).populate("comments").exec((err, data) => {
    if (err) {
      console.log(err)
      req.flash("Error", "Something went wrong")
      return res.redirect("/posts")
    } else {
      res.render("posts/show", {
        post: data
      });
    }
  })
})
//edit route
//show edit form
router.get("/:id/edit", middleware.checkPostOwnership, (req, res) => {
  Post.findById(req.params.id, (err, data) => {
    if (err) {
      console.log(err)
      req.flash("Error", "Something went wrong")
      return res.redirect("/posts")
    }
    res.render("posts/edit", {
      post: data
    })
  })
})
//Update route
//handle update logic
router.put("/:id", middleware.checkPostOwnership, upload.single('image'), (req, res) => {
  Post.findById(req.params.id, req.body.post, async function(err, data) {
    if (err) {
      console.log(err)
      req.flash("Error", "Something went wrong")
      return res.redirect("/posts")
    }
    if (req.file) {
      try {
        await cloudinary.v2.uploader.destroy(data.imageId);
        let result = await cloudinary.v2.uploader.upload(req.file.path);
        data.image = result.secure_url;
        data.imageId = result.public_id;
      } catch (err) {
        if (err) {
          return res.redirect("back")
        }
      }
    }
    data.body = req.body.body
    data.title = req.body.title
    data.save()
    res.redirect("/posts/" + req.params.id)
  })
})
//Destroy route
//handle deleting post logic
router.delete("/:id", middleware.checkPostOwnership, function (req, res) {
  Post.findByIdAndRemove(req.params.id, async function (err, data) {
    try {
      await cloudinary.v2.uploader.destroy(data.imageId);
      Comment.deleteMany({
        _id: {
          $in: data.comments
        }
      })
    } catch (err) {
      if (err) {
        console.log(err);
        return res.redirect("back");
      }
    }
    res.redirect("/posts")
  })
})
module.exports = router;