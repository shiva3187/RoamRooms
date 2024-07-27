const mongoose=require("mongoose");

const Schema=mongoose.Schema;




let bookingSchema=new Schema({
    Name:{
        type:String,
    },

     Email:{
        type:String,
     },

    phone:{
        type:Number,
    },
    chekin:{
        type:Date,
    },
    checkout:{
        type:Date,
    },
    roomType:{
        type:String,
    },
    guests:[
        {
        type:Number,
        
        }

    ]

});

const Booking=mongoose.model("booking",bookingSchema);
module.exports=Booking;