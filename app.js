const express          = require("express"),
bodyParser             = require("body-parser"),
mongoose               = require("mongoose"),
Post                   = require("./models/post"),
seedDB                 = require("./seed"),
app                    = express();

let port = 3000;
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
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
seedDB(); //seeder
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
    Post.findById(req.params.id, (err, data)=>{
        if (err) {
            console.log(error)
            return res.redirect("/")
        } else {
            res.render("posts/show", {post: data});
        }
    })
    
})
app.listen(port, ()=> console.log("server started"));