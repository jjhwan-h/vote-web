import Room from "./room";
import  Sequelize,{Model, CreationOptional, InferAttributes, InferCreationAttributes, BelongsToManyAddAssociationMixin, ForeignKey} from "sequelize";

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>
{
    declare id: CreationOptional<number>;
    declare name : string;
    declare email:string;
    declare tel:string;
    static initiate(sequelize: Sequelize.Sequelize){
        User.init({
            id:{
                type: Sequelize.INTEGER,
                primaryKey:true,
                autoIncrement:true,
            },
            name:{
                type:Sequelize.STRING,
                allowNull:false,
            },
            email:{
                type: Sequelize.STRING(20),
                allowNull:false,
                unique:true,
            },
            tel:{
                type:Sequelize.STRING(100),
                allowNull:false,
                unique:true,
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
    static associate(){
        User.belongsTo(Room,{   // 1:N 투표방생성자
            foreignKey:'RoomId',
            targetKey:'id'
        })
    }
}