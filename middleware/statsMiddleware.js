import mongoose from 'mongoose';
import Stats from '../models/statsModel.js';

let dbConnected = false;

export const setDbConnected = (connected) => {
  dbConnected = connected;
};

export const trackAPIStats = async (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', async () => {
    // Skip if DB not connected
    if (!dbConnected || !mongoose.connection.readyState) return;
    
    try {
      // Skip tracking for OPTIONS and HEAD requests
      if (!['OPTIONS', 'HEAD'].includes(req.method)) {
        const duration = Date.now() - start;
        await Stats.create({
          endpoint: req.originalUrl,
          method: req.method,
          responseTime: duration,
          statusCode: res.statusCode
        });
      }
    } catch (error) {
      // Log error but don't crash the app
    }
  });
  
  next();
};