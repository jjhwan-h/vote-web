import  Sequelize,{Model, CreationOptional, InferAttributes, InferCreationAttributes, BelongsToManyAddAssociationMixin, ForeignKey} from "sequelize";

export default class Email extends Model<InferAttributes<Email>, InferCreationAttributes<Email>>
{
    declare id: CreationOptional<number>;
    declare email:string;
    declare token:string;
    declare isValid:boolean;
    static initiate(sequelize: Sequelize.Sequelize){
        Email.init({
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
            token:{
                type:Sequelize.STRING(100),
                allowNull:false,
            },
            isValid:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Email',
            tableName: 'email',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        })
    }
}