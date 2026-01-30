import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Branch = sequelize.define('Branch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isIn: [['Nairobi HQ', 'Kisumu', 'Mombasa', 'Nakuru', 'Eldoret']],
    },
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isHeadquarter: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  tableName: 'branches',
});

export default Branch;
