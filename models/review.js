const mongoose=require("mongoose");

const Schema=mongoose.Schema;


const reviewSchema=new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    CreatedAt:{
        type:Date,
        default:Date.now(),

    },
});

const Review=mongoose.model("review",reviewSchema);
module.exports=Review;