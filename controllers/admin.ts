import bcrypt from 'bcrypt';
import passport,{AuthenticateCallback,AuthenticateOptions} from 'passport';
import Admin from '../models/admin';
import { RequestHandler } from 'express';
import dotenv from 'dotenv';



dotenv.config();

const login: RequestHandler = (req, res, next) => {
    passport.authenticate('local', (authError:string|undefined, user:Admin|undefined, info:any) => {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return res.redirect(`/?loginError=${info.message}`);
      }
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.redirect('/admin/index');
      });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

const join :RequestHandler=async (req,res,next)=>{
    const {nick, password} = req.body;
    try{
        const exUser = await Admin.findOne({where:{nick}});
        if(exUser){
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password,15); //12~31
        await Admin.create({
            nick,
            password:hash
        });
        return res.redirect('/auth');
    }catch(error){
        console.error(error);
        return next(error);
    }
}
/**
 * req.user객체와 req.session객체를 제거.
 */
const logout: RequestHandler=(req,res)=>{
    req.logout(()=>{
        res.redirect('/admin/login');
    });
};

const renderSignIn: RequestHandler= (req, res) => {
    res.render('admin/login', { title: 'admin-login' });
  };

const renderIndex: RequestHandler=(req,res)=>{
    res.render('admin/index',{title: 'admin-index'});
}

export {login,join,logout,renderSignIn, renderIndex};