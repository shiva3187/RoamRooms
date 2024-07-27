const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js")
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

const validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      console.log(errMsg);
      throw new ExpressError(400,errMsg);
    }
    else{ 
    next();
    }
  };

//Index Route
router.get("/", isLoggedIn,wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }));
  
  //New Route
  router.get("/new", isLoggedIn,(req, res) => {
    res.render("listings/new.ejs");
  });
  
  //Show Route
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not Exist");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", { listing });
  }));
  
  //Create Route
  router.post("/",isLoggedIn,upload.single('listing[image]'), validatelisting,wrapAsync(async (req, res,next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename);
      const newListing = new Listing(req.body.listing);
      newListing.image={url,filename};
      await newListing.save();
      req.flash("success","New Listing Created");
      res.redirect("/listings"); 
    
   
  }));

  
  
  //Edit Route
  router.get("/:id/edit",isLoggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    
    if(!listing){
      req.flash("error","Listing you requested for does not Exist");
      res.redirect("/listings")
  }
    res.render("listings/edit.ejs", { listing });
  }));
  
  //Update Route
  // router.put("/:id",isLoggedIn, validatelisting,wrapAsync(async (req, res) => {
  //   let { id } = req.params;
   
  //   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  //   req.flash("success","Listing Update");
  //   res.redirect(`/listings/${id}`);
  // }));


  router.put("/:id", isLoggedIn, upload.single('listing[image]'), validatelisting, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
  
    // Update other fields
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.country = req.body.listing.country;
    listing.location = req.body.listing.location;
  
    // Update the image if a new one is uploaded
    if (req.file) {
      listing.image.url = req.file.path;
      listing.image.filename = req.file.filename;
    }
  
    await listing.save();
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${listing._id}`);
  }));
  
  //Delete Route
  router.delete("/:id", isLoggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
  }));

  module.exports=router;
  