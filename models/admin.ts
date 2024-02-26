import  Sequelize,{Model, CreationOptional, InferAttributes, InferCreationAttributes} from "sequelize";

export default class Admin extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>>
{
    declare id: CreationOptional<number>;
    declare nick:string;
    declare password:CreationOptional<string>;

    static initiate(sequelize: Sequelize.Sequelize){
        Admin.init({
            id:{
                type: Sequelize.INTEGER,
                primaryKey:true,
                autoIncrement:true,
            },
            nick:{
                type: Sequelize.STRING(20),
                allowNull:false,
                unique:true,
            },
            password:{
                type:Sequelize.STRING(100),
                allowNull:false,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Admin',
            tableName: 'admin',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }
}