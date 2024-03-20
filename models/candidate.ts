import Room from "./room";
import  Sequelize,{Model, CreationOptional, InferAttributes, InferCreationAttributes, ForeignKey} from "sequelize";

export default class Candidate extends Model<InferAttributes<Candidate>, InferCreationAttributes<Candidate>>
{
    declare id: CreationOptional<number>;
    declare name:string;
    declare gender:string;
    declare age:number;
    declare url:string;
    declare resume:string;
    declare RoomId:ForeignKey<Room['id']>;
    static initiate(sequelize: Sequelize.Sequelize){
        Candidate.init({
            id:{
                type: Sequelize.INTEGER,
                primaryKey:true,
                autoIncrement:true,
            },
            name:{
                type: Sequelize.STRING(20),
                allowNull:false,
            },
            gender:{
                type:Sequelize.STRING(10),
                allowNull:false,
            },
            age:{
                type:Sequelize.INTEGER,
                allowNull:false,
            },
            url:{
                type:Sequelize.STRING(100),
                allowNull:false,
            },
            resume:{
                type:Sequelize.STRING(500),
                allowNull:false,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Candidate',
            tableName: 'candidate',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }
    static associate(){
        Candidate.belongsTo(Room,{
            foreignKey:'RoomId',
            targetKey:'id'
        })
    }
}
