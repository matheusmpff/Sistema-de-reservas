import express from "express";

const MainRouter = express.Router();

MainRouter.get("/", (req,res) =>{
    res.json({msg: "Oiii"});
});

export default MainRouter;