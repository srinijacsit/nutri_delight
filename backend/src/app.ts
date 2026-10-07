import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

export default app;
