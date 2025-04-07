import FirecrawlApp from '@mendable/firecrawl-js';
import { ScrapedData } from '../types';
import config from '../config';

const app = new FirecrawlApp({
  apiKey: config.firecrawl.apiKey
});

class ScraperService {
  /*
   * Scrape a webpage using Firecrawl SDK with schema-based extraction
   */
  async scrapeWebpage(url: string): Promise<ScrapedData> {
    try {
      console.log("Scraping webpage:", url);
  
      const scrapeResult = await app.scrapeUrl(url, {
        formats: ['html']
      });
  
      if (!scrapeResult.success) {
        throw new Error(`Firecrawl scrape failed: ${scrapeResult.error}`);
      }
  
      return {
        url,
        html: scrapeResult.html ?? '',
        metadata: scrapeResult.metadata ?? {}
      };
  
    } catch (error) {
      console.error('Error scraping webpage:', error);
      throw error;
    }
  }
}  

export default new ScraperService();
