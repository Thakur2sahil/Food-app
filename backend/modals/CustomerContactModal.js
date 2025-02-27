import sequelize from "../sequelize.js";
import { DataTypes } from "sequelize";

const CustomerContact = sequelize.define('customer_contact', {
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
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  favorite_food: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true
  }
}, {
  timestamps: false, // Disable automatic timestamp fields (createdAt, updatedAt)
  tableName: 'customer_contacts', // Specify the table name
  schema: 'sahil' // Specify the schema name
});

export { CustomerContact };
