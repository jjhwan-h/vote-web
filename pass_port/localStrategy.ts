import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';
import bcrypt from 'bcrypt';
import Admin from '../models/admin';

export default () =>{
    passport.use(new LocalStrategy({
        usernameField:'nick',
        passwordField:'password',
    } , async(nick,password,done)=>{
        try{
             const exUser = await Admin.findOne({where:{nick}});
            if(exUser){
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    done(null,exUser);
                }else{
                    done(null,false,{message:'비밀번호가 일치하지 않습니다.'});
                }
            }else{
                done(null,false,{message:'존재하지 않는 admin입니다.'});
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    }))
}