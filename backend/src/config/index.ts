import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  firecrawl: {
    apiKey: process.env.FIRECRAWL_API_KEY,
    baseUrl: 'https://api.firecrawl.dev'
  },
  alai: {
    email: process.env.ALAI_EMAIL!,
    password: process.env.ALAI_PASSWORD!,
    baseUrl: 'https://api.getalai.com'
  }
};