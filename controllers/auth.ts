import { RequestHandler } from 'express';
import {transporter} from '../configs/email';
import dotenv from 'dotenv';
import Email from '../models/email';
import User from '../models/user';
dotenv.config();

const generateRandom = function(min:number, max:number) {
  const randomNumber = Math.floor(Math.random() * (max-min+1)) + min;
  return randomNumber
}

const generateEmailVerificationToken = ()=>{
  const token = crypto.randomUUID();
  const expires = new Date();
  expires.setHours(expires.getHours() +1);
  return {token, expires};
}

const sendEmail:RequestHandler=async(req,res,next)=>{
  const email:string = req.body.email;
  console.log(email)
  
  const result = generateEmailVerificationToken();
  const mailOptions = {
    to : email, //사용자가 입력한 이메일 -> 목적지 주소 이메일
    html: `<p>Please click the following link to verify your email address:</p>
    <p> <a href="http://${process.env.URL}:${process.env.SERVER_PORT}/auth/verify/?email=${email}&token=${result.token}">Verify email</a></p>
    <p>This link will expire on ${result.expires}.</p>`
  };

  const exEmail = await Email.findOne({where:{email}});

  try{
    if(exEmail){
      await exEmail.update({token:result.token})
    }else{
      await Email.create({
        email,
        token:result.token,
        isValid:false
      })
    }
    transporter.sendMail(mailOptions,(err,response)=>{
      console.log(response);
      if(err) {
        res.json({ok : false , msg : ' 메일 전송에 실패하였습니다. '})
        transporter.close() //전송종료
        return
    } else {
        res.json({ok: true, msg: ' 메일 전송에 성공하였습니다. '});
        transporter.close() //전송종료
        return 
    }
    });
  }catch(error){
    console.error('Error:: creating or updating emailTable:', error);
    return next(error);
  }
}

const verifyEmail :RequestHandler = async(req,res,next)=>{
    const email:string = req.query.email as string;
    const token: string = req.query.token as string;
    console.log(email, token);
    
    try{
      const exEmail = await Email.findOne({where:{email}});
      if(exEmail){
        const originToken = exEmail.token;
        if(token===originToken){
          await exEmail.update({isValid:true});
          res.send('인증완료');
        }
        else{
          res.send("인증실패");
        }
      }
      else{
        res.status(404).send('email 전송요청을 먼저해주세요');
      }
    }
    catch(error){
      console.error('Error:: While verifyEmail:', error);
      return next(error);
    }
}

const join :RequestHandler=async (req,res,next)=>{ //VC발급
  const {email, name, tel} = req.body;
  console.log(email, name, tel)

  try{
      const exEmail = await Email.findOne({where:{email}}); //이메일 검증 확인
      if(exEmail){
        if(exEmail.isValid){
          await exEmail.update({isValid:false}); //다른 사람이 동일한 이메일로 가입하는 것을 방지
          /**VC발급 */
        
          return res.redirect('/?message=가입성공');
        }
        else{
          return res.redirect(`/join?error=이메일의 인증버튼을 먼저눌러주세요`);
        }
      }
      else{
        return res.redirect(`/join?error=이메일 인증을 먼저 해주세요`);
      }
  }catch(error){
    console.error('Error:: While join:', error);
    return next(error);
  }
}

const login: RequestHandler=async(req,res,next)=>{ //VP검증
  res.send("VP검증");
}

export {login, join,verifyEmail, sendEmail}