const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExamMark = sequelize.define('ExamMark', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  exam_id:      { type: DataTypes.INTEGER, allowNull: false },
  student_id:   { type: DataTypes.INTEGER, allowNull: false },
  class_id:     { type: DataTypes.INTEGER, allowNull: false },
  section_id:   { type: DataTypes.INTEGER, allowNull: true },
  subject_name: { type: DataTypes.STRING(100), allowNull: false },

  theory_marks:    { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  practical_marks: { type: DataTypes.DECIMAL(5, 2), allowNull: true, defaultValue: 0 },
  total_marks:     { type: DataTypes.DECIMAL(5, 2), allowNull: true },

  grade:      { type: DataTypes.STRING(5),  allowNull: true },
  is_absent:  { type: DataTypes.BOOLEAN,    defaultValue: false },
  is_submitted: { type: DataTypes.BOOLEAN,  defaultValue: false },

  entered_by:  { type: DataTypes.INTEGER,   allowNull: true },
  entered_at:  { type: DataTypes.DATE,      allowNull: true },
}, {
  tableName: 'exam_marks',
  timestamps: true,
  createdAt: 'entered_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['exam_id'] },
    { fields: ['student_id'] },
    { fields: ['exam_id', 'class_id', 'section_id', 'subject_name'] },
    { fields: ['is_submitted'] },
  ],
});

module.exports = ExamMark;
