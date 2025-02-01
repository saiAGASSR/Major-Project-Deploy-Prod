import express from 'express';
import session from 'express-session';
import flash from  'connect-flash'

import hello from './routes/greet.js'
import path   from "path";
import {dirname}   from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);
const app  = express();

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));



const sessionConfig = {
    secret: 'keyboard cat', 
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  };

app.use(session(sessionConfig));
app.use(flash());
// app.use("/hello",hello);

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.failureMsg = req.flash("failure");
    next();
})



app.get("/registerFlash",(req,res)=>{
    // res.send(`Hello ${sessionObject.name}`)
    let {name ="anonymous"} = req.query;

    req.session.name = name;  
    if(name === "anonymous" ){
        req.flash("failure","registration unsuccessful");

    }else{
        req.flash("success","registration successful");

    }
    res.redirect(`/hello`);
})

app.get("/hello" , (req,res)=>{
    let  name =   req.session.name;  
    // let msg = req.flash("success");
    // res.locals.flashMsg = req.flash("success")
    // console.log(flashMsg);
    
    // res.render("greet",{name , flashMsg : msg} );
    res.render("greet",{name} );
})




app.listen("3000" , (req,res)=>{
    console.log("app is listening on port 3000");
    
})