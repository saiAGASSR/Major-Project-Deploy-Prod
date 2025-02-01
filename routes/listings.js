import express from 'express';
import wrapAsync from '../utils/wrapAsyncError.js';
import middlewares from '../middleware.js';
import listingController from "../controller/listings.js";
import multer from 'multer';
import { storage } from '../cloudinaryConfig.js';

const upload = multer({storage})

const {listingValidation , isLoggedIn, isOwner } = middlewares;
const {allListings , getSingleListing , getNewListting, postaddnewListing , getEditListing , putEditNewListing , destroyListing , destroyAllListing} = listingController;

const  router = express.Router();


router.route("/")
    .get(wrapAsync(allListings))
    .post( isLoggedIn, isOwner, upload.single('image'),listingValidation ,wrapAsync(postaddnewListing) )
    // .post( isLoggedIn, isOwner ,wrapAsync(postaddnewListing) )


router.get("/new",isLoggedIn, wrapAsync(getNewListting));

router.get("/:id", wrapAsync(getSingleListing));

router.route("/edit/:id")
    .get( isLoggedIn  ,isOwner , wrapAsync(getEditListing))
    .put(isLoggedIn,isOwner, upload.single('listing[image]'),wrapAsync(putEditNewListing));

router.delete("/delete/:id", isLoggedIn , isOwner ,wrapAsync(destroyListing));

router.delete("/" , isLoggedIn, wrapAsync(destroyAllListing));


export default router;


