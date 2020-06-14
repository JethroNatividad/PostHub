const express = require("express"),
bodyParser = require("body-parser"),
app = express();
let port = 3000;
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}));
//landing page
app.get("/", (req, res)=>{
    res.render("landing");
});
var posts = [
    {
        title: "post 1",
        image: "https://images.unsplash.com/photo-1591993221022-c3b5ee009325?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
    },
    {
        title: "post 1",
        image: "https://images.unsplash.com/photo-1591993221022-c3b5ee009325?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
    },
    {
        title: "post 1",
        image: "https://images.unsplash.com/photo-1591993221022-c3b5ee009325?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
    }
]
//posts index
app.get("/posts",(req, res)=>{
    res.render("posts/index", {posts: posts, page: "active"});
});
//post new
//show form
app.get("/posts/new", (req, res)=>{
    res.render("posts/new")
});
//post create
//handle create post logic
app.post("/posts", (req, res)=>{
    posts.push(req.body.post);
    res.redirect("/posts");
})
app.listen(port, ()=> console.log("server started"));