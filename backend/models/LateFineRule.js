const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LateFineRule = sequelize.define('LateFineRule', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  academic_year_id: { type: DataTypes.INTEGER,       allowNull: false },
  due_day:          { type: DataTypes.INTEGER,       allowNull: false, defaultValue: 10 },
  fine_type:        { type: DataTypes.ENUM('per_day','fixed'), allowNull: false, defaultValue: 'per_day' },
  fine_amount:      { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 5 },
  grace_period:     { type: DataTypes.INTEGER,       allowNull: false, defaultValue: 3 },
  max_fine:         { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 500 },
  apply_to:         { type: DataTypes.ENUM('all','per_class'), allowNull: false, defaultValue: 'all' },
  class_id:         { type: DataTypes.INTEGER,       allowNull: true },
  is_active:        { type: DataTypes.BOOLEAN,       defaultValue: true },
}, {
  tableName: 'late_fine_rules',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = LateFineRule;
