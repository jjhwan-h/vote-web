import {Sequelize} from 'sequelize'
import configObj from '../configs/config';
import User from './user';
import Admin from './admin';
import Room from './room';

const env = process.env.NODE_ENV as 'production' | 'test' || 'development';
console.log(env)
const config = configObj[env];
export const sequelize = new Sequelize(config.database,config.username, config.password,config);

User.initiate(sequelize);
Admin.initiate(sequelize);
Room.initiate(sequelize);

// User.associate();
// Admin.associate();
// Room.associate();


//const basename = path.basename(__filename);
//
// fs
//   .readdirSync(__dirname) // 현재 폴더의 모든 파일을 조회
//   .filter((file:string) => { // 숨김 파일, index.ts, ts 확장자가 아닌 파일 필터링
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts') && (file !== "interfaces");
//   })
//   .forEach((file:string) => { // 해당 파일의 모델 불러와서 init
//     const model = require(path.join(__dirname, file));
//     console.log(file, model.name);
//     db[model.name] = model;
//     model.initiate(sequelize);
//   })
// Object.keys(db).forEach(modelName => { // associate 호출
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });