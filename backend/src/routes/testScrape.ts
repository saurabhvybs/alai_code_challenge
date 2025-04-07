import { Router, Request, Response } from 'express';
import FireCrawlApp from '@mendable/firecrawl-js';

const router = Router();

const app = new FireCrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY
});


router.post('/test-scrape', async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: 'URL is required'
    });
  }

  try {
    const result = await app.scrapeUrl(url, {
      formats: ['markdown'],
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Internal Server Error'
    });
  }
});

export default router;
