const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Class = require('./Class');

const Section = sequelize.define('Section', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'classes',
      key: 'id',
    },
  },
  section_name: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
}, {
  tableName: 'sections',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Associations
Section.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });
Class.hasMany(Section, { foreignKey: 'class_id', as: 'sections' });

module.exports = Section;
