const express          = require("express"),
bodyParser             = require("body-parser"),
mongoose               = require("mongoose"),
Post                   = require("./models/post"),
Comment                = require("./models/comment"),
postsRoute             = require("./routes/posts"),
commentsRoute          = require("./routes/comments"),
indexRoute             = require("./routes/comments"),
methodOverride         = require("method-override"),
seedDB                 = require("./seed"),
app                    = express();
let port = 3000;
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
//mongoose
//mongoose setup
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb+srv://jethrosama:undeadban07@master-2viyl.mongodb.net/posthublocal?retryWrites=true&w=majority");
//seedDB(); //seeder
//routes
app.use("/", indexRoute)
app.use("/posts", postsRoute)
app.use("/posts/:id/comments", commentsRoute)
app.listen(port, ()=> console.log("server started"));