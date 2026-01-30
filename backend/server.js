import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Import database and models
import { syncDatabase } from './src/models/index.js';

// Import routes with correct paths
import authRoutes from './src/routes/authRoutes.js';
import saleRoutes from './src/routes/saleRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import reportRoutes from './src/routes/reportRoutes.js';
import branchRoutes from './src/routes/branchRoutes.js';

const app = express();

const initializeDatabase = async () => {
  try {
    await syncDatabase();
    console.log('SQLite connected successfully');
  } catch (error) {
    console.error('SQLite connection error:', error.message);
    process.exit(1);
  }
};

initializeDatabase();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/branches', branchRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
