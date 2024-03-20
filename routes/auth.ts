import express from 'express'
import { isNotLoggedIn, isLoggedIn } from '../middlewares/index';
import {login,join ,sendEmail, verifyEmail} from "../controllers/auth";
const router = express.Router();
import multer from "multer";

const storage = multer.memoryStorage();
const upload= multer({storage:storage});

//POST /auth/login
router.post('/login',isNotLoggedIn,login);
//POST /auth/join
router.post('/join',upload.none(),join);

//POST /auth/email
router.post('/email',sendEmail);
//GET /auth/verify
router.get('/verify',verifyEmail);

export {router};

