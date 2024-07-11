const mongoose=require("mongoose");

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
        type:String,
        default:"https://pbs.twimg.com/media/C1i4ahkW8AIjKCe.jpg",
        set:(v)=>v===""?"https://pbs.twimg.com/media/C1i4ahkW8AIjKCe.jpg":v,
    },
    country:{
        type:String,
    }

});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;    