const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExamResult = sequelize.define('ExamResult', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  exam_id:    { type: DataTypes.INTEGER, allowNull: false },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  class_id:   { type: DataTypes.INTEGER, allowNull: true },
  section_id: { type: DataTypes.INTEGER, allowNull: true },

  total_obtained: { type: DataTypes.DECIMAL(7, 2), defaultValue: 0 },
  total_max:      { type: DataTypes.DECIMAL(7, 2), defaultValue: 0 },
  percentage:     { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },

  grade:          { type: DataTypes.STRING(5),  allowNull: true },
  grade_points:   { type: DataTypes.DECIMAL(3, 1), defaultValue: 0 },
  rank_in_class:  { type: DataTypes.INTEGER,    allowNull: true },

  result: {
    type: DataTypes.ENUM('pass', 'fail', 'absent'),
    defaultValue: 'fail',
  },

  class_teacher_remark: { type: DataTypes.TEXT, allowNull: true },

  declared_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'exam_results',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['exam_id'] },
    { fields: ['student_id'] },
    { fields: ['exam_id', 'student_id'], unique: true },
    { fields: ['class_id'] },
    { fields: ['result'] },
  ],
});

module.exports = ExamResult;
