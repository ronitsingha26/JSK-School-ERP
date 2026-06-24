const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AcademicYear = sequelize.define('AcademicYear', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  year_name: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  is_current: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'academic_years',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = AcademicYear;
