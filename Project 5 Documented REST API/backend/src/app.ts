import path from 'path';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import instrumentRoutes from './routes/instrument.routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { ok } from './utils/apiResponse';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? '*' }));
app.use(express.json());

// Swagger UI served from the static OpenAPI spec — the spec is the contract, not an afterthought
const openApiDocument = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, { customSiteTitle: 'PharmaTrack API Docs' }));

app.get('/api/v1/health', (req, res) =>
  ok(res, { status: 'up', timestamp: new Date().toISOString() }, 'Service healthy')
);

app.use('/api/v1/instruments', instrumentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
