var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//INDEX route
router.get('/campgrounds', function(req, res){
    // console.log(req.user);
    // Get all campgrounds from DB
    Campground.find({}, function(err, allcampgrounds){
        if(err){
            console.log(err);
        }else {
             res.render("campgrounds/index", {campgrounds: allcampgrounds, currentUser: req.user});
        }
      });
  });

//CREATE Route
router.post("/campgrounds", isLoggedIn, function(req, res){
    
   //get data from form and add to campgrounds array
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newCampground = {name: name, image: image, description: desc, author: author};
   // console.log(req.user)
   //create a new campground and save to DB
   Campground.create(newCampground, function(err, newlyCreated){
      if(err){
          console.log(err);
      } else {
          res.redirect("/campgrounds");
      }
   });
  
});
//NEW Route make sure this is declared above campgrounds/*

router.get("/campgrounds/new", isLoggedIn, function(req, res){
   res.render("campgrounds/new.ejs");
    
});

//SHOW Route - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
       // console.log(foundCampground);    
    //render show template with that campground
        res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT ROUTE
router.get("/campgrounds/:id/edit", function(req, res){
    if(req.isAuthenticated()){
        
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            if(foundCampground.author.id.equals(req.user._id)){
             res.render("campgrounds/edit", {campground:foundCampground });
        }else {
            res.send("No permission to access this resource.");
        }
        }
    });
        
    }else {
        console.log("You have to be logged in for that");
        res.send("You have to logged in for that");
    }
});

//UPDATE Route
router.put("/campgrounds/:id", function(req, res){
  //  req.body.blog.body = req.sanitize(req.body.blog.body);    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else{
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//DELETE Route
router.delete("/campgrounds/:id", function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.direct("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
   });
    
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
        res.redirect("/login");
}

module.exports = router;