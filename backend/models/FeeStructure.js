const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FeeStructure = sequelize.define('FeeStructure', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  fee_head_id:      { type: DataTypes.INTEGER,       allowNull: false },
  class_id:         { type: DataTypes.INTEGER,       allowNull: false },
  academic_year_id: { type: DataTypes.INTEGER,       allowNull: false },
  monthly_amount:   { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
  annual_amount:    { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
  is_active:        { type: DataTypes.BOOLEAN,       defaultValue: true },
}, {
  tableName: 'fee_structures',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { unique: true, fields: ['fee_head_id', 'class_id', 'academic_year_id'] },
    { fields: ['class_id'] },
    { fields: ['academic_year_id'] },
  ],
});

module.exports = FeeStructure;
