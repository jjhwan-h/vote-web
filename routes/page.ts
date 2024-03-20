import express from 'express'
import { renderMain, renderVoteRoom, renderVoteRoomCreate, renderJoin }  from '../controllers/page';
const router = express.Router();

// router.use((req, res, next) => {
//   res.locals.user  = req.user;
//   next();
// });

router.get('/',renderMain);
router.get('/voteRoom',renderVoteRoom);
router.get('/voteRoomCreate',renderVoteRoomCreate); //TODO: 방생성전에 DID발급 및 VC발급
router.get('/join',renderJoin);
export {router};

