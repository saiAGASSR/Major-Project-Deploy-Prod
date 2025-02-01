import express from 'express';

const  router = express.Router({mergeParams: true});

router.get("/" ,async (req,res,next)=>{       
        res.send("Helloooo")
} )


export default router;