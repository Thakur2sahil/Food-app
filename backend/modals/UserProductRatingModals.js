import sequelize from "../sequelize.js";
import { DataTypes } from "sequelize";

const UserProductRating = sequelize.define('user_product_rating', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  review: {
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
  tableName: 'user_product_ratings', // Specify the table name
  schema: 'sahil', // Specify the schema name
  validate: {
    ratingRange() {
      if (this.rating < 1 || this.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }
    }
  }
});

export { UserProductRating };
