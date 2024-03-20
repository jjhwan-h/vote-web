import { RequestHandler } from "express";
import { FaberInquirer } from "../src/FaberInquirer";
import { container } from "tsyringe";
import 'reflect-metadata';
import Room from "../models/room";
import User from "../models/user";
import * as gcs from "@google-cloud/storage";
import dotenv from 'dotenv';
import { text } from "figlet";
import { IProcessedUser } from "./interfaces/IProcessedUser";
import {IProcessedCandidate} from "./interfaces/IProcessedCandidate";
import Candidate from "models/candidate";

dotenv.config();

export const renderVoteRoom: RequestHandler= (req, res) => {
  res.render('voteRoom', { title: '투표방 - DIDVote' });
};

export const makeConnection:RequestHandler= async (req,res)=>{
    const faberInquirer : FaberInquirer = container.resolve(FaberInquirer);
    const outOfBand = await faberInquirer.faber.agent.oob.createInvitation();
    faberInquirer.faber.outOfBandId = outOfBand.id;
    const URL =  outOfBand.outOfBandInvitation.toUrl({domain:`http://localhost:${faberInquirer.faber.port}`})

    res.send(URL)
}

export const afterFileUpload:RequestHandler=async (req,res)=>{
  // let Url="";
  // const {roomName, roomDesc, hostEmail, inputType, textAreaInput, imgUrl} = req.body;
  //   if(imgUrl) Url=imgUrl
  //   else Url = process.env.DEFAULT_IMG!

  //   await Room.create({
  //     approve:false,
  //     name:roomName,
  //     desc:roomDesc,
  //     img:Url,
  //   }).then(async (el)=>{
  //       const roomId = el.get("id");
  //       let user;
  //       let processedUser:IProcessedUser[]=[];
  //       if(textAreaInput) user = JSON.parse(textAreaInput);
  //       else user = JSON.parse(req.file!.buffer.toString('utf-8'));

  //       for (const key in user){
  //         let rand = Math.random().toString(36).substr(2, 3) + "-" + Math.random().toString(36).substr(2, 3) + "-" + Math.random().toString(36).substr(2, 4);
  //         processedUser.push({
  //           email:user[key],
  //           key:rand,
  //           RoomId:roomId
  //         })
  //       }
  //       // console.log(`processedUser : ${processedUser}`)

  //       await User.bulkCreate(processedUser);
  //       res.send(roomId.toString());
  //   }).catch(err=>{
  //     console.error(err);
  //   })
}

export const afterImgUpload:RequestHandler=async(req,res)=>{
  res.send(req.file?.path);
}

export const afterCandidateUpload:RequestHandler=async(req,res)=>{
  console.log(req.files);
  console.log(req.body);
  const imgs = req.files;
  const candidate = req.body;
  let proCandidate:IProcessedCandidate=[];

  // for(let i=0;i<imgs.length();i++){

  // }
  // await Candidate.bulkCreate();
}
export const waitConnection:RequestHandler= async (req,res)=>{
// /**변경할것. */

//   const Issuer = new Faber();
//   const outOfBand = await Issuer.agent.oob.createInvitation();
//   Issuer.outOfBandId=outOfBand.id;

//   console.log(
//     outOfBand.outOfBandInvitation.toUrl({domain:`http://localhost:${Issuer.port}`})
//   );

}
