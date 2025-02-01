import express from 'express';
import wrapAsync from '../utils/wrapAsyncError.js';
import passport from 'passport';
import middlewares from '../middleware.js';
import usersController from "../controller/users.js"

let {getSignUp ,  getLogin  , getLogOut , postSignUp , postLogin } = usersController;

const {saveRedirectURL } = middlewares;

const  router = express.Router();

router.route("/signUp")
    .get( wrapAsync(getSignUp))
    .post(wrapAsync(postSignUp));

router.route("/login")
    .get(wrapAsync(getLogin))
    .post(saveRedirectURL,passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }), wrapAsync(postLogin))

router.get("/logout", wrapAsync(getLogOut))

export default router;