import 'dotenv/config';

if (process.env.NODE_ENV === "development") {
    console.log("Development mode: environment variables loaded");
}

if (process.env.NODE_ENV === "production") {
    console.log("production mode: environment variables loaded");
}

console.log(process.env.CLOUD_API_KEY);



import express from 'express';
import mongoose from 'mongoose';
import path   from "path";
import {dirname}   from "path";
import { fileURLToPath } from "url";
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import customError from './utils/customError.js';

//Routes
import listingsRouter from './routes/listings.js';
import reviewsRouter from './routes/reviews.js';
import usersRouter from './routes/users.js';

// Mongo session.
import session from 'express-session';
import MongoStore from 'connect-mongo';


import flash from 'connect-flash';
import passport from 'passport';
import  LocalStrategy from 'passport-local';
import User from './models/users.js';


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

const app = express(); 


//Mongo Url 


const mongo_url = process.env.MongoDBConnectionURL
console.log(mongo_url);

const secret = process.env.secretKey;

const mongostoreConfig = {
        mongoUrl : mongo_url,
        crypto: {
            secret: secret,
            touchAfter :24 * 3600

          }
        
    };



const sessionConfig = {

        secret: secret,
        resave: false,
        store: MongoStore.create(mongostoreConfig),
        saveUninitialized: true,
        cookie: { 
            expires : Date.now() + 9 * 24 * 60 * 60 * 1000,
            maxAge : 9 * 24 * 60 * 60 * 1000 ,
            httpOnly : true
         }
}

sessionConfig.store.on("error",()=>{

            console.log("errore  while connecting to mongo session ",err);
            
})


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({extended: true}));

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")))
app.use(methodOverride('_method'));

app.use((req,res,next)=>{
    res.locals.listingSuccessMsg = req.flash("listingSuccess");
    res.locals.listingErrorMsg = req.flash("listingError");
    res.locals.currUser = req.user;
    console.log("Auth message ?", res.locals.listingErrorMsg);
    
    next();
}) 

app.use("/listings",listingsRouter);
app.use("/listing/:id/reviews",reviewsRouter);
app.use("/",usersRouter);



app.engine('ejs',ejsMate)

app.listen(8080, ()=>{
    console.log(`app is listening on port number 8080`);
    
})


async function main (){
    await  mongoose.connect(mongo_url)
}

main()
    .then(()=>{
        console.log("connected to db successfully ");
        
    })
    .catch((err)=>{
        console.log(err);
        
    })



app.get("/demoUser",async(req,res)=>{
    let fakeUser = {
        username : "saifakerreeer",
        email : "sai@faker.com"
    }

    let result = await User.register(fakeUser,"helloWorld");
    res.send(result);
})
    



app.all("*",(req,res,next)=>{
    next (new customError(404,"Page not found "))
})

// app.use((err,req,res,next)=>{
//     next( new customError(500,err.message) )
// })

app.use((err,req,res,next)=>{
    console.log(err);
    let {statusCode = 500 , message = "something went wrong "} = err;
    res.status(statusCode).render("listings/error.ejs" , {err})
    // res.status(statusCode).send(message);
})



// app.get("/",wrapAsync(async(req,res)=>{
    //     res.send("working ");
    // }));
    
    // app.get("/testListing", wrapAsync(async(req,res)=>{
    //     let sampleListing = new Listing({
    //         title       : "My Dream Bike mt-07",
    //         description : "I love this bike",
    //         image       : "",
    //         // image : "https://imgd.aeplcdn.com/1280x720/n/cw/ec/146941/mt-07-right-front-three-quarter.jpeg?isig=0",
    //         location    : "hyderabad",
    //         country     : "INDIA",
    //         price       : 1500000
    //     })
    //     await sampleListing.save();
    //     console.log("saved");
    //     res.send("saved")
        
    // }));