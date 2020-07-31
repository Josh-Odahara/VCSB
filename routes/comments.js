var express = require("express");
var router = express.Router();
var Skatepark = require("../models/skatepark");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/skateparks/:id/comments/new", middleware.isLoggedIn, function(req, res){
	Skatepark.findById(req.params.id, function(err, skatepark){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {skatepark: skatepark});
		}
	});
});

router.post("/skateparks/:id/comments", middleware.isLoggedIn, function(req, res){
	Skatepark.findById(req.params.id, function(err, skatepark){
		if(err){
			console.log(err);
			res.redirect("/skateparks");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					skatepark.comments.push(comment);
					skatepark.save();
					console.log(comment);
					req.flash("success", "Succesfully added comment!");
					res.redirect("/skateparks/" + skatepark._id);
				}
			});
		}
	});
});

router.get("/skateparks/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {skatepark_id: req.params.id, comment: foundComment});
		}
	});
});

//comments update router

router.put("/skateparks/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/skateparks/" + req.params.id);
		}
	})	;
});

//comment deletes routes 

router.delete("/skateparks/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted!");
			res.redirect("/skateparks/" + req.params.id);
		}
	});
});

module.exports = router;