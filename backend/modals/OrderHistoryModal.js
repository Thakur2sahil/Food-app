import sequelize from "../sequelize.js";
import { DataTypes } from "sequelize";

const OrderHistory = sequelize.define('order_history', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  order_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending',
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true
  },
  rating_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: true
  }
}, {
  timestamps: false, // Disable automatic timestamp fields (createdAt, updatedAt)
  tableName: 'order_history', // Specify the table name
  schema: 'sahil', // Specify the schema name
  validate: {
    ratingRange() {
      if (this.rating && (this.rating < 1 || this.rating > 5)) {
        throw new Error('Rating must be between 1 and 5');
      }
    }
  }
});

export { OrderHistory };
