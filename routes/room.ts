import express, { RequestHandler } from 'express'
import { makeConnection, waitConnection, afterFileUpload, afterImgUpload, afterCandidateUpload} from '../controllers/room';
import MulterGoogleCloudStorage from 'multer-google-storage';
import multer from "multer";
import dotenv from "dotenv";
//import {hasDid, hasNotDid} from '../middlewares'

dotenv.config();
const router = express.Router();

const storage = multer.memoryStorage();
const upload= multer(
    {
        storage:storage,
        limits:{
            fileSize:5*1024*1024,
         }}
    );
const thumbnailUpload= 
    multer({
    storage: new MulterGoogleCloudStorage({
        bucket: process.env.BUCKET,
        keyFilename: process.env.KEY_FILENAME,
        projectId:process.env.PROJECT_ID,
        filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
            cb(null, `roomImg/${Date.now()}_${file.originalname}`);
          },
     }),
     limits:{
        fileSize:5*1024*1024,
     }
    });
const candidateUpload=
    multer({
    storage: new MulterGoogleCloudStorage({
        bucket: process.env.BUCKET,
        keyFilename: process.env.KEY_FILENAME,
        projectId:process.env.PROJECT_ID,
        filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
            cb(null, `canImg/${Date.now()}_${file.originalname}`);
          },
     }),
     limits:{
        fileSize:5*1024*1024,
     }
    });

router.get('/connection', makeConnection, waitConnection);
router.post('/upload',thumbnailUpload.single("imgFile"),afterImgUpload);
router.post('/create',upload.single("fileInput"),afterFileUpload);    // todo::vc확인? 가입확인
router.post('/candidate',candidateUpload.array("img",6),afterCandidateUpload);
export {router};

