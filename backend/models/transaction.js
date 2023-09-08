const {DataTypes, Model} = require("sequelize");

class Transaction extends Model{
    static init(sequelize){
        return super.init(
            {
                // 구매자, users 테이블의 id 참조
                buyer :{
                    type : DataTypes.INTEGER,
                    allowNull : false,
                },
                // 판매자, users 테이블의 id 참조
                seller :{
                    type : DataTypes.INTEGER,
                    allowNull : false,
                },
                // 거래 기간(마감)
                transaction_date : {
                    type : DataTypes.DATE
                },
                // 어떤 매물인지 식별, 매물 테이블의 id 참조
                real_estate_id :{
                    type : DataTypes.INTEGER,
                    allowNull : false,
                },
                // 취소 여부
                cancel :{
                    type : DataTypes.INTEGER,
                    defaultValue : null,
                },
                // 판매자의 승인 여부
                approved :{
                    type : DataTypes.BOOLEAN,
                    defaultValue : false,
                },
                // 거래 완료 여부 (현재 날짜 > 거래 날짜 일 때 true)
                completed :{
                    type : DataTypes.BOOLEAN,
                    defaultValue : false,
                }

            },{
                sequelize,
                underscored : false,
                timestamps : true,
                modelName : "Transaction",
                tableName : "transaction",
                charset : "utf8",
                collate : "utf8_general_ci"
            }
        )
    }

    static assicoate(db) {

        db.Transaction.belongsTo(db.User, { foreignKey : "buyer", targetKey : "id", as: 'Buyer'});
        db.Transaction.belongsTo(db.User, { foreignKey : "seller", targetKey : "id", as: 'Seller'});
        db.Transaction.belongsTo(db.User, { foreignKey : "cancel", targetKey : "id"});
        db.Transaction.belongsTo(db.Real_estate, { foreignKey : "real_estate_id", targetKey : "id"});

    }
}

module.exports = Transaction;