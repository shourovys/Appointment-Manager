import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { NextFunction, Request, Response } from 'express';
import serverlessHttp from 'serverless-http';
import { AppModule } from './app.module.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';

// Serverless handler for Netlify Functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedHandler: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function bootstrap(): Promise<any> {
  if (!cachedHandler) {
    const expressApp = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    // Handle CORS explicitly before other middleware
    const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Request-ID, Access-Control-Request-Method, Access-Control-Request-Headers',
      );
      res.header('Access-Control-Allow-Credentials', 'true');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }
      next();
    };
    expressApp.use(corsMiddleware);

    // Enable CORS with specific configuration
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
      credentials: true,
    });

    // Set global prefix for all routes
    app.setGlobalPrefix('api');

    // Apply global response transformation interceptor
    app.useGlobalInterceptors(new TransformInterceptor());

    // Setup Swagger
    const config = new DocumentBuilder()
      .setTitle('Smart Appointment & Queue Manager API')
      .setDescription('API for managing appointments, staff, services, and queues')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    cachedHandler = serverlessHttp(expressApp);
  }
  return cachedHandler;
}

// Lambda handler for Netlify Functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = async (event: any, context: any): Promise<any> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const serverlessHandler = await bootstrap();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return serverlessHandler(event, context);
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};

// For local development
if (
  process.env.NODE_ENV === 'development' ||
  (process.argv[1] && import.meta.url.endsWith(process.argv[1]))
) {
  const PORT = process.env.PORT || 3000;
  async function startLocal(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    // Handle CORS explicitly before other middleware
    const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Request-ID, Access-Control-Request-Method, Access-Control-Request-Headers',
      );
      res.header('Access-Control-Allow-Credentials', 'true');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }
      next();
    };
    app.use(corsMiddleware);

    // Enable CORS with specific configuration
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
      credentials: true,
    });

    // Set global prefix for all routes
    app.setGlobalPrefix('api');

    // Apply global response transformation interceptor
    app.useGlobalInterceptors(new TransformInterceptor());

    // Setup Swagger
    const config = new DocumentBuilder()
      .setTitle('Smart Appointment & Queue Manager API')
      .setDescription('API for managing appointments, staff, services, and queues')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(PORT);
    // eslint-disable-next-line no-console
    console.log(`Application is running on: http://localhost:${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`API docs available at: http://localhost:${PORT}/api/docs`);
  }

  void startLocal();
}
