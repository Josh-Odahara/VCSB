var express        = require("express"),
	mongoose   	   = require('mongoose'),
	app            = express(),
	bodyParser     = require("body-parser"),
	passport       = require("passport"),
	flash          = require("connect-flash"),
	localStrategy  = require("passport-local"),
	methodOverride = require("method-override"),
	Skatepark 	   = require("./models/skatepark"),
	Comment    	   = require("./models/comment"),
	User       	   = require("./models/user"),
	seedDB     	   = require("./seed");

var commentRoutes    = require("./routes/comments"),
	skateparkRoutes = require("./routes/skateparks"),
	authRoutes       = require("./routes/auth");

// seedDB(); - seeding the database
app.use(flash());
app.use(require("express-session")({
	secret: "Bitch",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect('mongodb://localhost:27017/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use(commentRoutes);
app.use(skateparkRoutes);
app.use(authRoutes);

app.listen(process.env.PORT || 3500, process.env.IP, function(){
	console.log("Skatepark server has started!");
});