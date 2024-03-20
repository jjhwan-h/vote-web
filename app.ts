import 'reflect-metadata';
import express, { ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';
import nunjucks from 'nunjucks';
import dotenv from 'dotenv';
import passport from 'passport';
import {FaberInquirer, runFaber } from './src/FaberInquirer';
import {router as pageRouter} from './routes/page';
import {router as roomRouter} from './routes/room';
import {router as authRouter} from './routes/auth';
import {router as adminRouter} from './routes/admin';
import {container} from 'tsyringe';
import {sequelize} from './models/index';
import passportConfig from './pass_port/index';

dotenv.config();
passportConfig();

const app = express();

app.set('port', process.env.SERVER_PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

sequelize.sync({force:false}) // force. 서버를 실행할때마다 테이블 재생성
    .then(()=>{
        console.log('데이터베이스 연결 성공');
    })
    .catch((err:string)=>{
        console.log(err);
    });


app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // req.cookies객체로 만들고, 해당 서버가 만든 쿠키인지 검증
app.use(session({ //express-session 1.5버전이전이라면 cookieParser뒤에 위치해야한다.(내부적으로 cookieParser를 사용함.)
  resave: false,  //요청이 올때 세션에 수정사항이 없더라도 다시 저장?
  saveUninitialized: false, //세션에 저장할 내역이 없더라도 처음부터 세션생성?
  secret: process.env.COOKIE_SECRET!, //쿠키에 서명
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 2* 60 * 60 * 1000 // 2시간
  },
}));

app.use(passport.initialize()); //req객체에 passport 설정을 심는다.
app.use(passport.session());  //req.session객체에 passport정보 저장 => session선언 뒤에 선언

const port = process.env.PORT
const name = process.env.NAME
container.register("port",{useValue:port})
container.register("name",{useValue:name})
container.resolve(FaberInquirer);

app.use('/', pageRouter);
app.use('/room', roomRouter);
app.use('/auth',authRouter);
app.use('/admin',adminRouter);


app.use((req, res, next) => {
  const error : Error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`); 
  error.status = 404; //import되는 것이 아니기때문에 tsconfig.json에 "ts-node" : {"files":true} 옵션을 추가한다.
  next(error);
});

const errorHandler:ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
  res.render('error');
};
app.use(errorHandler);


export default app;