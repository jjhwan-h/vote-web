import express, { RequestHandler } from "express";

export const getPublic : RequestHandler = async(req,res,next)=>{
    express.static("../public/assets");
    express.static("../public/cover.css");
    next();
}

