const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  /* ── Admission ── */
  admission_no:     { type: DataTypes.STRING(20),  allowNull: false, unique: true },
  admission_date:   { type: DataTypes.DATEONLY,    allowNull: false },
  academic_year_id: { type: DataTypes.INTEGER,     allowNull: true  },
  class_id:         { type: DataTypes.INTEGER,     allowNull: true  },
  section_id:       { type: DataTypes.INTEGER,     allowNull: true  },
  roll_number:      { type: DataTypes.STRING(10),  allowNull: true  },

  /* ── Personal ── */
  first_name:   { type: DataTypes.STRING(60),  allowNull: false },
  last_name:    { type: DataTypes.STRING(60),  allowNull: false },
  father_name:  { type: DataTypes.STRING(100), allowNull: false },
  mother_name:  { type: DataTypes.STRING(100), allowNull: true  },
  dob:          { type: DataTypes.DATEONLY,    allowNull: true  },
  gender:       { type: DataTypes.ENUM('Male','Female','Other'), allowNull: true },
  blood_group:  { type: DataTypes.STRING(5),   allowNull: true  },
  religion:     { type: DataTypes.STRING(40),  allowNull: true  },
  category:     { type: DataTypes.ENUM('General','OBC','SC','ST','Other'), allowNull: true },
  nationality:  { type: DataTypes.STRING(40),  defaultValue: 'Indian' },

  /* ── Contact ── */
  mobile:                    { type: DataTypes.STRING(15), allowNull: false },
  alternate_mobile:          { type: DataTypes.STRING(15), allowNull: true  },
  email:                     { type: DataTypes.STRING(150),allowNull: true  },
  address:                   { type: DataTypes.TEXT,       allowNull: true  },
  city:                      { type: DataTypes.STRING(60), allowNull: true  },
  state:                     { type: DataTypes.STRING(60), allowNull: true  },
  pin_code:                  { type: DataTypes.STRING(10), allowNull: true  },
  emergency_contact_name:    { type: DataTypes.STRING(100),allowNull: true  },
  emergency_contact_number:  { type: DataTypes.STRING(15), allowNull: true  },

  /* ── Academic extras ── */
  previous_school: { type: DataTypes.STRING(200), allowNull: true },
  previous_class:  { type: DataTypes.STRING(20),  allowNull: true },
  bus_facility:    { type: DataTypes.BOOLEAN,      defaultValue: false },
  bus_route:       { type: DataTypes.STRING(100),  allowNull: true },
  hostel_facility: { type: DataTypes.BOOLEAN,      defaultValue: false },

  /* ── Documents ── */
  photo_url:       { type: DataTypes.STRING(500), allowNull: true },
  aadhar_url:      { type: DataTypes.STRING(500), allowNull: true },
  birth_cert_url:  { type: DataTypes.STRING(500), allowNull: true },
  tc_url:          { type: DataTypes.STRING(500), allowNull: true },
  marksheet_url:   { type: DataTypes.STRING(500), allowNull: true },

  /* ── Status ── */
  status: { type: DataTypes.ENUM('Active','Inactive'), defaultValue: 'Active' },
}, {
  tableName: 'students',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['admission_no'] },
    { fields: ['class_id'] },
    { fields: ['section_id'] },
    { fields: ['status'] },
    { fields: ['mobile'] },
  ],
});

module.exports = Student;
