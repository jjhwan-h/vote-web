import express from 'express'
import { renderMain, renderVoteRoom }  from '../controllers/page';
import {getPublic} from '../controllers/public';
const router = express.Router();

// router.use((req, res, next) => {
//   res.locals.user  = req.user;
//   next();
// });
// router.get('/profile', isLoggedIn, renderProfile);
// router.get('/join', isNotLoggedIn, renderJoin);

router.get('/', getPublic,renderMain);
router.get('/voteRoom',renderVoteRoom);

export {router};

