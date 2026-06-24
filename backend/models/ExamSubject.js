const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExamSubject = sequelize.define('ExamSubject', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  exam_id:    { type: DataTypes.INTEGER, allowNull: false },
  class_id:   { type: DataTypes.INTEGER, allowNull: false },

  // subject stored as string for flexibility (no Subject master yet)
  subject_name: { type: DataTypes.STRING(100), allowNull: false },

  exam_date: { type: DataTypes.DATEONLY, allowNull: true },
  exam_time: { type: DataTypes.STRING(20), allowNull: true, defaultValue: '10:00 AM' },

  max_theory_marks:    { type: DataTypes.DECIMAL(5, 2), defaultValue: 100 },
  max_practical_marks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  pass_marks:          { type: DataTypes.DECIMAL(5, 2), defaultValue: 33 },

  is_practical: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'exam_subjects',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['exam_id'] },
    { fields: ['class_id'] },
    { fields: ['exam_id', 'class_id'] },
  ],
});

module.exports = ExamSubject;
