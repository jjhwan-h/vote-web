import  Sequelize,{Model, CreationOptional, InferAttributes, InferCreationAttributes} from "sequelize";

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>
{
    declare id: CreationOptional<number>;
    declare email:string;
    declare key:string;

    static initiate(sequelize: Sequelize.Sequelize){
        User.init({
            id:{
                type: Sequelize.INTEGER,
                primaryKey:true,
                autoIncrement:true,
            },
            email:{
                type: Sequelize.STRING(20),
                allowNull:false,
                unique:true,
            },
            key:{
                type:Sequelize.STRING(100),
                allowNull:false,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'user',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }
}


// import * as SequelizeStatic from "sequelize";
// import {Sequelize} from "sequelize"
// export default class User extends SequelizeStatic.Model{
//     static initiate(sequelize:Sequelize){
//         User.init({
//             email:{
//                 type: SequelizeStatic.STRING(20),
//                 allowNull:false,
//                 unique:true,
//             },
//             key:{
//                 type:SequelizeStatic.STRING(100),
//                 allowNull:false,
//             }
//         },{
//             sequelize, //sequelize객체
//             timestamps:false, //날짜
//             underscored:false, //시퀼라이즈의 default인 캐멀케이스를 스네이크 케이스로 바꾸는 옵션
//             modelName:'User', // 모델이름
//             tableName:'user', // 실제 데이터베이스의 테이블이름
//             paranoid:false, //deletedAt 컬럼 생성? 완전히 삭제하지 않고 삭제시각을 기록(후에 복원될경우를 대비)
//             charset:'utf8',
//             collate:'utf8_general_ci',
//         })
//     }
// }