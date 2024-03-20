import express from 'express'
import { isNotLoggedIn, isLoggedIn } from '../middlewares/index';
import {login,renderSignIn,join, renderIndex} from "../controllers/admin";
const router = express.Router();

//GET /admin
router.get('/admin',renderSignIn);
//GET /admin/index
router.get('/admin/index',isLoggedIn,renderIndex);
//POST /admin/login
router.post('/admin/login',isNotLoggedIn,login);
//POST /admin/join
router.post('/admin/join',isNotLoggedIn,join);

export {router};