/**TO DO */
import  Sequelize,{Model, CreationOptional, InferAttributes, InferCreationAttributes, BelongsToManyGetAssociationsMixin} from "sequelize";
import User from "./user";
import Candidate from "./candidate";
export default class Room extends Model<InferAttributes<Room>, InferCreationAttributes<Room>>
{
    declare id: CreationOptional<number>;
    declare approve: boolean;
    declare name:string;
    declare desc:string;
    declare img:string;

    
    declare getUsers: BelongsToManyGetAssociationsMixin<User>;

    static initiate(sequelize: Sequelize.Sequelize){
        Room.init({
            id:{
                type: Sequelize.INTEGER,
                primaryKey:true,
                autoIncrement:true,
            },
            approve:{
                type: Sequelize.BOOLEAN,
                allowNull:false,
                defaultValue:false,
            },
            name:{
                type: Sequelize.STRING(20),
                allowNull:false,
            },
            desc:{
                type:Sequelize.STRING(100),
                allowNull:false,
            },
            img:{
                type:Sequelize.STRING(100),
                allowNull:true,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Room',
            tableName: 'room',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }
    static associate(){
        Room.hasOne(User,{ //N:1 방생성자
            foreignKey:'RoomId',sourceKey:'id'
        });
        Room.hasOne(Candidate,{
            foreignKey:'RoomId',sourceKey:'id'
        })
    }
}