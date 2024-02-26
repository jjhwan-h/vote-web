import express from 'express'
import {getPublic} from '../controllers/public';
import { isNotLoggedIn, isLoggedIn } from '../middlewares/index';
import {login,renderSignIn,join, renderIndex} from "../controllers/auth";
const router = express.Router();

//GET /auth
router.get('/',renderSignIn);
//GET /auth/index
router.get('/index',isLoggedIn,renderIndex);
//POST /auth/login
router.post('/login',isNotLoggedIn,login);
//POST /auth/join
router.post('/join',isNotLoggedIn,join);


export {router};

