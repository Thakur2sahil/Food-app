import sequelize from "../sequelize.js";
import { DataTypes } from "sequelize";

const CartAmount = sequelize.define('cartamount', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  order_id: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: false, // Disable automatic timestamp fields (createdAt, updatedAt)
  tableName: 'cartamount', // Specify the table name
  schema: 'sahil' // Specify the schema name
});

export { CartAmount };
