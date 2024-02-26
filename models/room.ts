/**TO DO */
import  Sequelize,{Model, CreationOptional, InferAttributes, InferCreationAttributes} from "sequelize";
import User from "./user";
export default class Room extends Model<InferAttributes<Room>, InferCreationAttributes<Room>>
{
    declare id: CreationOptional<number>;
    declare host: User
    declare name:string;
    declare desc:string;
    declare voter:User[];

    static initiate(sequelize: Sequelize.Sequelize){
        Room.init({
            id:{
                type: Sequelize.INTEGER,
                primaryKey:true,
                autoIncrement:true,
            },
            host:{
                type: User,
                
            }
            name:{
                type: Sequelize.STRING(20),
                allowNull:false,
                unique:true,
            },
            desc:{
                type:Sequelize.STRING(100),
                allowNull:false,
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
}