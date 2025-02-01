import User from '../models/users.js';


let getSignUp = async (req,res) =>{
    let sessionUsername =  req.session.username ;
    let sessionEmail =  req.session.email;
    let sessionPassword =  req.session.password;

    req.session.username = '';
    req.session.email = '';
    req.session.password = '';
    res.render("users/signUp.ejs",{sessionEmail,sessionPassword,sessionUsername})
}
let getLogin = async (req,res) =>{
    let sessionUsername =  req.session.username ;
    let sessionPassword =  req.session.password;

    req.session.username = '';
    req.session.password = '';
    console.log(req.session);
    if(req.session.messages && req.session.messages[0].length >0 ){
        console.log("into the auth message ?");
        
        let authErrorMessage = req.session.messages[0];
        console.log("aytherrorMsh",authErrorMessage);
        

        req.flash("authError",authErrorMessage);


    }
    let authError = req.flash("authError")
    res.render("users/login.ejs",{sessionUsername,sessionPassword , authError});
}  

let getLogOut = async (req,res,next) => {
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("listingSuccess", "logged Out Successfully");
        res.redirect("/listings");
    })
 
}

let postSignUp = async (req,res) =>{
    try
    {
        let {username , email , password } = req.body;
        let sessionUsername =  req.session.username = username;
        let sessionEmail =  req.session.email = email;
        let sessionPassword =  req.session.password = password;
     
        let newUser = new User({
         email : email,
         username : username
        })
     
         let result = await User.register(newUser,password);
         console.log(result);
         
         req.login(result,(err)=>{
            if(err){
                return next(err);

            }
            req.flash("listingSuccess","You are registered succesfully ");
            res.redirect("/listings");
         })

        
    } catch (err){
        req.flash("listingError",err.message);
        res.redirect("/signUp");
    }
} ;

let postLogin  = async (req,res)=>{
    req.flash("listingSuccess",`Welcome ${req.user.username}`);
    console.log("res local : " , res.locals );
    console.log("res local : " , res.locals.redirectUrl );
    
    if(typeof res.locals.redirectUrl !== "undefined"){
        res.redirect(res.locals.redirectUrl);
    }
    else{
    res.redirect("/listings");

    }
};

export default  {getSignUp ,  getLogin  , getLogOut , postSignUp , postLogin };