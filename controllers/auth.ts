import bcrypt from 'bcrypt';
import passport,{AuthenticateCallback,AuthenticateOptions} from 'passport';
import passportLocal from 'passport-local';
import Admin from '../models/admin';
import { RequestHandler } from 'express';


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

const login: RequestHandler = (req,res,next)=>{
    passport.authenticate('local',(authError:any, user:any, info:any)=>{ // 로컬로그인 전략
        if(authError){
            return next(authError);
        }
        if(!user){
            return res.redirect(`/auth?loginError=${info.message}`);
        }
        /**
         * passport는 req객체에 login과 logout메서드를  추가한다.
         * login은 serializeUser를 호출 req.login에 제공하는 user객체가 serializeUser로 넘어간다. 이때 세션쿠기가 브라우저에 전송됨.
         */
        return req.login(user,(loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError)
            }
            return res.redirect('/auth/index');
        });
    })(req,res,next);
};

/**
 * req.user객체와 req.session객체를 제거.
 */
const logout: RequestHandler=(req,res)=>{
    req.logout(()=>{
        res.redirect('/login');
    });
};

const renderSignIn: RequestHandler= (req, res) => {
    res.render('auth/login', { title: 'admin-login' });
  };

const renderIndex: RequestHandler=(req,res)=>{
    res.render('auth/index',{title: 'admin-index'});
}

export {login,join,logout,renderSignIn, renderIndex}