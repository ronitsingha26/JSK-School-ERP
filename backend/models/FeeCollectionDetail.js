const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FeeCollectionDetail = sequelize.define('FeeCollectionDetail', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  collection_id: { type: DataTypes.INTEGER,       allowNull: false },
  fee_head_id:   { type: DataTypes.INTEGER,       allowNull: false },
  month:         { type: DataTypes.STRING(20),    allowNull: true, comment: 'e.g. Apr 2025 or Yearly' },
  amount:        { type: DataTypes.DECIMAL(10,2), allowNull: false },
  discount:      { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  fine:          { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  net_amount:    { type: DataTypes.DECIMAL(10,2), allowNull: false },
}, {
  tableName: 'fee_collection_details',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['collection_id'] },
    { fields: ['fee_head_id'] },
  ],
});

module.exports = FeeCollectionDetail;
