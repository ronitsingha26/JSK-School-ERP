const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DiscountType = sequelize.define('DiscountType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  name:            { type: DataTypes.STRING(100),   allowNull: false },
  discount_type:   { type: DataTypes.ENUM('percentage','fixed'), allowNull: false, defaultValue: 'percentage' },
  value:           { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
  applicable_fees: { type: DataTypes.TEXT,          allowNull: true, comment: 'JSON array of fee_head_ids' },
  is_active:       { type: DataTypes.BOOLEAN,       defaultValue: true },
}, {
  tableName: 'discount_types',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = DiscountType;
