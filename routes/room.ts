import express from 'express'
import { makeConnection, waitConnection } from '../controllers/room';
import {hasDid, hasNotDid} from '../middlewares'
const router = express.Router();

// router.use((req, res, next) => {
//   res.locals.user  = req.user;
//   next();
// });
// router.get('/profile', isLoggedIn, renderProfile);
// router.get('/join', isNotLoggedIn, renderJoin);

router.get('/connection', makeConnection, waitConnection);
export {router};

