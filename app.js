if(process.env.NODE_ENV!="production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const { error } = require("console");

const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


const dbUrl=process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((error) => {
    console.log(error);
  });

async function main() {
  
  await mongoose.connect(dbUrl);
   
  }

  console.log('Connected to MongoDB');
    // Your application logic here
  

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine('ejs',ejsMate);


const store=MongoStore.create({
mongoUrl:dbUrl,
crypto:{
  secret:process.env.SECRET,
},
touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("error at mongo session store","error");
});


const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};

app.get("/", (req, res) => {
  res.redirect("/listings");
});



app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUser=req.user||null;
next();
});


// app.get("/demouser",async(req,res)=>{
//   let fakeuser=new User({
//    email:"Roamrooms@gmail.com",
//    username:"student",
//   });
//   let regUser=await User.register(fakeuser,"helloworld");
//   res.send(regUser);
// });


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
  next((new ExpressError (404,"PAGE NOT FOUND")))
});


app.use((err,req,res,next)=>{
  let {statusCode=500,message="SOMETHING WENT WRONG"}=err;
 
  res.status(statusCode).render("error.ejs",{message});
  next();
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});