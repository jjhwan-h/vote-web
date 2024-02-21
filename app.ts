import express, { ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import session from 'express-session';
import nunjucks from 'nunjucks';
import dotenv from 'dotenv';
import {Faber} from './src/Faber';

dotenv.config();
import {router as pageRouter} from './routes/page';
// import authRouter from './routes/auth';
// import postRouter from './routes/post';
// import userRouter from './routes/user';
// import { sequelize } from './models';

const app = express();

app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

// sequelize.sync({ force: false })
//   .then(() => {
//     console.log('데이터베이스 연결 성공');
//   })
//   .catch((err) => {
//     console.error(err);
//   });

const Issuer = new Faber(Number(process.env.PORT!),process.env.NAME!.toString());
if(!Issuer.anonCredsIssuerId) Issuer.createDid(process.env.REGISTRY!.toString());
else Issuer.importDid(process.env.REGISTRY!.toString());

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET!,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));


app.use('/', pageRouter);
// app.use('/auth', authRouter);
// app.use('/post', postRouter);
// app.use('/user', userRouter);

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