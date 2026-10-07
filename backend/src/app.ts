import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env';
import catalogRoutes from './routes/catalog.routes';
import profileRoutes from './routes/profile.routes';
import addressRoutes from './routes/address.routes';
import cartRoutes from './routes/cart.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(
  cors({
    origin: env.FRONTEND_URL,
  })
);
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Nutri Delight backend is running'
  });
});

app.use('/api', catalogRoutes); // Handles /categories, /products, etc.
app.use('/api/profile', profileRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart', cartRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
