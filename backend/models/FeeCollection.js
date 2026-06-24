const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FeeCollection = sequelize.define('FeeCollection', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  receipt_no:       { type: DataTypes.STRING(30),    allowNull: false, unique: true },
  student_id:       { type: DataTypes.INTEGER,       allowNull: false },
  academic_year_id: { type: DataTypes.INTEGER,       allowNull: false },
  total_amount:     { type: DataTypes.DECIMAL(10,2), allowNull: false },
  discount_amount:  { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  fine_amount:      { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  paid_amount:      { type: DataTypes.DECIMAL(10,2), allowNull: false },
  balance:          { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  payment_date:     { type: DataTypes.DATEONLY,       allowNull: false },
  payment_mode:     { type: DataTypes.ENUM('Cash','Online','Cheque'), allowNull: false },
  cheque_no:        { type: DataTypes.STRING(50),    allowNull: true },
  slip_no:          { type: DataTypes.STRING(50),    allowNull: true },
  remark:           { type: DataTypes.TEXT,          allowNull: true },
  collected_by:     { type: DataTypes.INTEGER,       allowNull: true },
  status:           { type: DataTypes.ENUM('Completed','Partial','Cancelled'), defaultValue: 'Completed' },
}, {
  tableName: 'fee_collections',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['student_id'] },
    { fields: ['receipt_no'] },
    { fields: ['payment_date'] },
    { fields: ['academic_year_id'] },
  ],
});

module.exports = FeeCollection;
