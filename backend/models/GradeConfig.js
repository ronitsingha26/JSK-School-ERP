const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GradeConfig = sequelize.define('GradeConfig', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  academic_year_id: { type: DataTypes.INTEGER, allowNull: true },

  min_marks: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  max_marks: { type: DataTypes.DECIMAL(5, 2), allowNull: false },

  grade:        { type: DataTypes.STRING(5),   allowNull: false },
  grade_points: { type: DataTypes.DECIMAL(3, 1), defaultValue: 0 },
  remarks:      { type: DataTypes.STRING(50),  allowNull: true },
}, {
  tableName: 'grade_config',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['academic_year_id'] },
  ],
});

module.exports = GradeConfig;
