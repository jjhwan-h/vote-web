import MulterGoogleCloudStorage from 'multer-google-storage';
import multer from 'multer';
import { RequestHandler } from 'express';

const storage = multer.memoryStorage();
const upload= multer({storage:storage});

const gcp_upload= 
    multer({
    storage: new MulterGoogleCloudStorage({
        bucket: process.env.BUCKET,
        keyFilename: process.env.KEY_FILENAME,
        projectId:process.env.PROJECT_ID,
        filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
            cb(null, `roomImg/${Date.now()}_${file.originalname}`);
          },
     })
    })

const fileHandling:RequestHandler=(req,res)=>{
    try{
        if(req.body.inputType==="file"){
            upload.single("fileInput");
        }
        gcp_upload.single("imgFile");
    }
    catch(err){
        console.error(err);
    }
}
