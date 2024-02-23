import { RequestHandler } from "express";

const hasDid :RequestHandler= (req, res, next) => {
    if (req) {
      next();
    } else {
      res.status(403).send('Did발급필요');
    }
  };
  
const hasNotDid :RequestHandler = (req, res, next) => {
    if (req) {
      next();
    } else {
      const message = encodeURIComponent('did발급완료된상태');
      res.redirect(`/?error=${message}`);
    }
}
    
export {hasDid, hasNotDid};
  