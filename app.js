require('dotenv').config()
const express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Post = require("./models/post"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  postsRoute = require("./routes/posts"),
  flash = require("connect-flash"),
  commentsRoute = require("./routes/comments"),
  indexRoute = require("./routes/index"),
  methodOverride = require("method-override"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  expressSession = require("express-session"),
  seedDB = require("./seed"),
  app = express();

let port = process.env.PORT || 80;
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
  extended: true
}));
app.locals.moment = require('moment');
app.use(express.static("public"));
app.use(express.static("assets"));
app.use(methodOverride("_method"));
app.use(flash())
//mongoose
//mongoose setup
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGOATLAS);
//Passport Auth setup
app.use(expressSession({
  secret: "nicenicenicenicenice",
  resave: false,
  saveUninitialized: false
}));

passport.use(new localStrategy(User.authenticate()));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//data of current user pass in all routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
//seedDB(); //seeder
//routes
app.use("/posts", postsRoute)
app.use("/posts/:id/comments", commentsRoute)
app.use("/", indexRoute)
app.listen(port, () => console.log("server started"));