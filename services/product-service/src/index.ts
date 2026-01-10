import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDatabase } from './config/database';
import { setupSwagger } from './config/swagger';
import productRoutes from './routes/productRoutes';
import reviewRoutes from './routes/reviewRoutes';
import { PORT_CONFIG, DEFAULT_CORS_ORIGINS } from '@3asoftwares/utils';
import { Logger } from '@3asoftwares/utils/server';

// Load .env.local first, then .env as fallback
const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config({ path: envPath });
}

// Configure logger for Product service
Logger.configure({
  enableConsole: true,
  enableFile: process.env.ENABLE_FILE_LOGGING === 'true',
  logFilePath: process.env.LOG_FILE_PATH || 'logs/product-service.log',
  logLevel: process.env.LOG_LEVEL || 'debug',
});

const app: Application = express();
const PORT = process.env.PORT || PORT_CONFIG.PRODUCT;

app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || DEFAULT_CORS_ORIGINS,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Product service is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);

// Setup Swagger documentation
setupSwagger(app);

app.use((req: Request, res: Response) => {
  Logger.warn(`Route not found: ${req.method} ${req.path}`, undefined, 'Router');
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

app.use((err: any, req: Request, res: Response, __: any) => {
  Logger.error(
    `Unhandled error: ${err.message}`,
    { stack: err.stack, path: req.path, method: req.method },
    'ErrorHandler'
  );
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      Logger.info(`Product service running on port ${PORT}`, undefined, 'Server');
      Logger.info(
        `Swagger docs available at http://localhost:${PORT}/api-docs`,
        undefined,
        'Server'
      );
    });
  } catch (error) {
    Logger.error('Failed to start Product service', error, 'Server');
    process.exit(1);
  }
};

startServer();

export default app;
