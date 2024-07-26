const mongoose=require("mongoose");
const Review = require("./review.js");

const Schema=mongoose.Schema;

let listingSchema=new Schema({
    title:{
        type:String,
    },

     description:{
        type:String,
     },

    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"review"
        }

    ]

});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;    