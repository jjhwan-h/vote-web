import { RequestHandler } from "express";

export const renderVoteRoom: RequestHandler= (req, res) => {
  res.render('voteRoom', { title: '투표방 - DIDVote' });
};

export const renderMain : RequestHandler = async (req, res, next) => {
    res.render('main',{
      title:'DIDvote',
    });
};

// export const renderHashtag: RequestHandler= async (req,res,next)=>{
//   const query = req.query.hashtag;
//   if(!query){
//     return res.redirect('/');
//   }
//   try{
//     const hashtag = await Hashtag.findOne({where:{title:query}});
//     let posts=[];
//     if(hashtag){
//       posts = await hashtag.getPosts({include:[{model:User}]}); //hashtag에 해당하는 post를 가져온다. 작성자정보를 합쳐 가져온다.
//     }
//     return res.render('main',{
//       title:`${query} | NodeBird`,
//       twits:posts,
//     });
//   }catch(error){
//     console.error(error);
//     return next(error);
//   }
// }
