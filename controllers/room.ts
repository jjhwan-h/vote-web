import { RequestHandler } from "express";

export const renderVoteRoom: RequestHandler= (req, res) => {
  res.render('voteRoom', { title: '투표방 - DIDVote' });
};

export const makeConnection: RequestHandler=(req,res)=>{
    
}
