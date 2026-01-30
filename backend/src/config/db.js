import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connected successfully');
    return sequelize;
  } catch (error) {
    console.error('SQLite connection error:', error.message);
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;
