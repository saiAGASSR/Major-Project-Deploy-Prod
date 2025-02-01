import express from 'express';
import session from 'express-session';

const app  = express();

const sessionConfig = {
    secret: 'keyboard cat', 
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  };

app.use(session(sessionConfig));

// https://www.npmjs.com/package/express-session
app.get("/",(req,res)=>{
    res.send("Home");
})

app.get("/reqCount",(req,res)=>{
    res.send(`You sent the requests x TIMES `);
})

app.get("/learningaboutsessionparams",(req,res)=>{
    // let {name = "default anonymous"} = req.params;
    let {name = "default anonymous"} = req.query;
    console.log(`Before assigning -> ${req.session}`,req.session);
    
    req.session.name = name;
    console.log(`After assigning -> ${req.session}`,req.session);

    let sessionObject = req.session;
    
    // sessionObject.name = name;
    console.log(sessionObject);
    
    res.send(`Hi ${name} The object is ${sessionObject}`);
})

app.get("/assignedNameInSessionAccessedInanothercallback",(req,res)=>{
    // res.send(`Hello ${sessionObject.name}`)
    res.send(`Hello ${req.session.name}`)
})

app.get("/forAnyRouteOrPage",(req,res)=>{

    if(req.session.count){
        console.log("present");
        
        req.session.count++;
    }else{
        console.log("not present");
        
        req.session.count = 1
    }

    res.send(`<br> ${req.session.count}  <br>configured session will create an session id for the <br> there will be a connect.sid  , the current connection seiion id will be created  for every request   session id will be saved in browser in the form of cookie   <br>   resave: false,saveUninitialized: true, cookie: { secure: true }  when i add these config i did not see sessionID  , but when i removed them i  got to see sessionId  and <br>  when we open the same tab or we say clon the same tab we got the same session id because express will detect the same browser <br>  Becasue Express will detect the browser  will detect the tabs opening the same link <br>  so if we open the same websites link in different tabs we can see the same cart links <br> browser wise  <br> A single session defines that when a same client and server have single or many requests <br> when the single session request arrives we initialize the new count variable o that = 1 and increase the count in if condition  `);
})


app.listen("3000" , (req,res)=>{
    console.log("app is listening on port 3000");
    
})