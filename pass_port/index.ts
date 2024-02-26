import passport from 'passport';
import local from './localStrategy';
import Admin from '../models/admin';

export default () => {
    
  passport.serializeUser((user , done) => {  //로그인 시 실행 => 세션 객체에 어떤 데이터를 저장할지 결정 done(에러, 저장하고싶은데이터)
    done(null, user.id);
  });

/**
 * //각 요청마다 실행  serializeUser의 두번째 인수가 매개변수가된다.
 * 라우터에 요청이 도달하기 전에 passpport.session 미들웨어가 passport.deserializeUser메서드 호출
 * connect.sid세션 쿠키를 읽고 세션 객체를 찾아서 req.session으로 만든다.
 * req.session에 저장된 아이디로 데이터베이스에서 admin조회
 * 조회된 admin정보 req.user에 저장
 * 라우터에서 req.user객체 사용가능.
 */
  passport.deserializeUser((id: number, done) => {  
    Admin.findOne({
      where: { id },
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local();
};