import express from 'express'
import { makeConnection } from 'controllers/room';
const router = express.Router();

// router.use((req, res, next) => {
//   res.locals.user  = req.user;
//   next();
// });
// router.get('/profile', isLoggedIn, renderProfile);
// router.get('/join', isNotLoggedIn, renderJoin);

router.get('/connection', makeConnection);
export {router};

