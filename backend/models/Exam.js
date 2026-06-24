const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exam = sequelize.define('Exam', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  name: { type: DataTypes.STRING(150), allowNull: false },

  academic_year_id: { type: DataTypes.INTEGER, allowNull: true },

  exam_type: {
    type: DataTypes.ENUM('unit_test', 'half_yearly', 'annual', 'pre_board', 'custom'),
    defaultValue: 'unit_test',
  },

  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date:   { type: DataTypes.DATEONLY, allowNull: false },

  result_date: { type: DataTypes.DATEONLY, allowNull: true },

  // JSON array of class IDs e.g. [1,2,3,4,5]
  apply_to_classes: {
    type: DataTypes.JSON,
    defaultValue: [],
  },

  status: {
    type: DataTypes.ENUM('draft', 'active', 'completed'),
    defaultValue: 'draft',
  },

  description: { type: DataTypes.TEXT, allowNull: true },

  created_by: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'exams',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['status'] },
    { fields: ['academic_year_id'] },
    { fields: ['exam_type'] },
  ],
});

module.exports = Exam;
