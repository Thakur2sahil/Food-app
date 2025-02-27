import sequelize from "../sequelize.js";
import { DataTypes } from "sequelize";

const Product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  photo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    allowNull: true
  },
  rating_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: true
  },
  discount: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    allowNull: true
  }
}, {
  timestamps: false, // Disable automatic timestamp fields (createdAt, updatedAt)
  tableName: 'products', // Specify the table name
  schema: 'sahil' // Specify the schema name
});

export { Product };
