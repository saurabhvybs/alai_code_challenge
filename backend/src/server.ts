import express from 'express';
import config from './config';
import presentationRoutes from './routes/presentationRoutes';
import testScrapeRoute from './routes/testScrape';
import { errorHandler, notFound } from './middleware/errorMiddleware';

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', presentationRoutes);
app.use('/api', testScrapeRoute);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;