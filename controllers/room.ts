import { RequestHandler } from "express";
import { FaberInquirer } from "../src/FaberInquirer";
import { container } from "tsyringe";
import 'reflect-metadata';
export const renderVoteRoom: RequestHandler= (req, res) => {
  res.render('voteRoom', { title: '투표방 - DIDVote' });
};

export const makeConnection:RequestHandler= async (req,res)=>{
    const faberInquirer : FaberInquirer = container.resolve(FaberInquirer);
    console.log("123")
    const outOfBand = await faberInquirer.faber.agent.oob.createInvitation();
    console.log("456")
    faberInquirer.faber.outOfBandId = outOfBand.id;
    console.log(faberInquirer.faber.port)
    const URL =  outOfBand.outOfBandInvitation.toUrl({domain:`http://localhost:${faberInquirer.faber.port}`})
    console.log(URL);

    res.send(URL)
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
