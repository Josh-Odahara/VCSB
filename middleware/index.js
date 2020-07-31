var Skatepark = require("../models/skatepark");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkSkateparkOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Skatepark.findById(req.params.id, function(err, foundSkatepark){
		if(err){
			req.flash("error", "Skatepark not found...");
			res.redirect("back");
		} else {
		if(foundSkatepark.author.id.equals(req.user._id)){
			next();

		} else{
			req.flash("error", "You do not have permission to do that");
			res.redirect("back");
				}
			}
		});	
		} else {
			req.flash("error", "You need to be logged in to do that!");
			res.redirect("back");
		}
	}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
		if(foundComment.author.id.equals(req.user._id)){
			next();
		} else{
			req.flash("error", "You dont have permission to do that");
			res.redirect("back");
				}
			}
		});	
		} else {
			req.flash("error", "You need to be logged in to do that");
			res.redirect("back");
		}
	}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}

module.exports = middlewareObj