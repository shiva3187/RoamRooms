const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const reviews=require("../routes/review.js");
const Listing = require("../models/listing.js");
const Review=require("../models/review.js");

const validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg=err.details.map((el)=>el.meesage).join(",");
      throw new ExpressError(400,error);
    }
    else{
    next();
    }
  };

//reviews route

router.post("/",validatereview,wrapAsync(async(req,res)=>{
    console.log(req.params.id);
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.reviews);
  
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
  
    console.log("new review saved");
    req.flash("success","New Review Added");
    res.redirect(`/listings/${listing._id}`);
  
  }));
  
  //delete review route
  router.delete("/:reviewId",wrapAsync(async(req,res)=>{
  
  let {id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted");
  res.redirect(`/listings/${id}`);
  
  }));

  module.exports=router;