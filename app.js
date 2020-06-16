const express          = require("express"),
bodyParser             = require("body-parser"),
mongoose               = require("mongoose"),
Post                   = require("./models/post"),
Comment                = require("./models/comment"),
methodOverride         = require("method-override"),
seedDB                 = require("./seed"),
app                    = express();

let port = 3000;
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
//landing page
app.get("/", (req, res)=>{
    res.render("landing");
});
//mongoose
//mongoose setup
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://jethrosama:undeadban07@master-2viyl.mongodb.net/posthublocal?retryWrites=true&w=majority");
//seedDB(); //seeder
//posts index
app.get("/posts", (req, res)=>{
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
app.get("/posts/new", (req, res)=>{
    res.render("posts/new", {page: "create"})
});
//post create
//handle create post logic
app.post("/posts", (req, res)=>{
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
app.get("/posts/:id", (req, res)=>{
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
app.get("/posts/:id/edit", (req, res)=>{
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
app.put("/posts/:id", (req, res)=>{
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
app.delete("/posts/:id", (req, res)=>{
  Post.findByIdAndRemove(req.params.id, (err, data)=>{
    if (err) {
      console.log(error)
      return res.redirect("/")
    }
    res.redirect("/posts")
  })
})

//========Comments==========
//Create route
//create comment and push to post
app.post('/posts/:id/comments', (req, res)=>{
  //create comment
  req.body.comment.author = "Admin"
  Comment.create(req.body.comment, (err, comment)=>{
    if (err) {
      console.log(error)
      return res.redirect("/")
    } 
    //find post
    Post.findById(req.params.id, (err, post)=>{
      //push comment to post
      post.comments.push(comment)
      post.save((err)=>{
        if (err) {
          console.log(error)
          return res.redirect("/")
        }
        //redirect somewhere
        res.redirect("/posts/"+ req.params.id)
      })
    })
  })
})
//Edit route
//render edit
app.get("/posts/:id/comments/:commentId/edit", (req, res)=>{
  Comment.findById(req.params.commentId, (err, comment)=>{
    if (err) {
      console.log(error)
      return res.redirect("/")
    }
    res.render("comments/edit", {comment: comment, postId: req.params.id})
  })
})
//update route
//handle update logic
app.put("/posts/:id/comments/:commentId", (req, res)=>{
  //find comment and update
  Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err)=>{
    if (err) {
      console.log(error)
      return res.redirect("/")
    }
      //redirect somewhere
      res.redirect("/posts/"+ req.params.id)
  })
})

app.listen(port, ()=> console.log("server started"));