const express=require("express");
const router=express.Router();

router.get("/book",(req, res) => {
    res.render("bookings/book.ejs");
  });
  

  module.exports=router;