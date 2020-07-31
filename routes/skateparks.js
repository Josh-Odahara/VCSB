var express = require("express");
var router = express.Router();
var Skatepark = require("../models/skatepark");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/skateparks", function(req,res){
	Skatepark.find({}, function(err, allSkateparks){
		if(err){
			console.log(err);
		} else {
			res.render("skateparks/index", {skateparks: allSkateparks, currentUser: req.user});
		}
	});
});	

router.post("/skateparks", middleware.isLoggedIn, function(req, res){
	var name =req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newSkateparks = {name: name, image: image, description: description, author: author};
	Skatepark.create(newSkateparks, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			console.log(newlyCreated);
			res.redirect("/skateparks");
		}
	});
});

router.get("/skateparks/new", middleware.isLoggedIn, function(req,res){
	res.render("skateparks/new.ejs");
});

router.get("/skateparks/:id", function(req, res){
	Skatepark.findById(req.params.id).populate("comments").exec(function(err, foundSkatepark){
		if(err){
			console.log(err);
		} else{
			res.render("skateparks/show", {skatepark: foundSkatepark});
		}
	});
	});

//edit routes

router.get("/skateparks/:id/edit", middleware.checkSkateparkOwnership, function(req,res){
	Skatepark.findById(req.params.id, function(err, foundSkatepark){
		res.render("skateparks/edit", {skatepark: foundSkatepark});
	});	
});
	
	


//updates routes


router.put("/skateparks/:id", middleware.checkSkateparkOwnership, function(req, res){
	//finding and updating 
	Skatepark.findByIdAndUpdate(req.params.id, req.body.skatepark, function(err, updatedSkatepark){
		if(err){
			res.redirect("/");
		} else {
			res.redirect("/skateparks/" + req.params.id);
		}
	});
});

//destory router

router.delete("/skateparks/:id", middleware.checkSkateparkOwnership, function(req,res){
	Skatepark.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/skateparks");
		} else {
			res.redirect("/skateparks");
		}
	});
});


module.exports = router;