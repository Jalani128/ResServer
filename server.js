import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';
import connectdb from './config/mongodb.js';
import userRoutes from './routes/userRoutes.js';
import teamRouter from './routes/teamRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import adminRouter from './routes/adminRoutes.js';

dotenv.config({ path: ".env.local" });

const app = express();

// CORS - MUST be placed before express.json() and routes
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://localhost:4000',
    'http://127.0.0.1:4000',
    'https://admin-rse.vercel.app',
    'https://real-estate-frontend-eta.vercel.app',
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Extra safety fix for OPTIONS requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
}));
app.use(compression());
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));
app.use(mongoSanitize());

// Database
(async () => {
  await connectdb();
})();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/team', teamRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/', (req, res) => res.json({ success: true, message: 'API is running' }));

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;