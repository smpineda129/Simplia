import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { context, getContext } from './utils/context.js';
import { corsOptions } from './config/cors.js';
import { swaggerSpec } from './config/swagger.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';

const app = express();

app.use((req, res, next) => {
  context.run(new Map(), () => {
    next();
  });
});

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files
app.use('/public', express.static('public', {
  setHeaders: (res, path) => {
    if (path.includes('temp')) {
      res.setHeader('Content-Disposition', 'attachment');
    }
  }
}));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a GDI API',
    documentation: '/api-docs',
    version: '1.0.0',
  });
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

export default app;
