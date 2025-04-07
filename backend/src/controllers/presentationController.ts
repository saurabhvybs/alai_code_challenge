import { Request, Response } from 'express';
import authService from '../services/authService';
import scraperService from '../services/scraperService';
import contentService from '../services/contentService';
import presentationService from '../services/presentationService';
import { ConvertRequest } from '../types';

class PresentationController {
  /**
   * Convert a webpage to an Alai presentation
   */
  async convertWebpage(req: Request, res: Response): Promise<void> {
    const { url } = req.body as ConvertRequest;
    
    if (!url) {
      res.status(400).json({ 
        success: false, 
        error: 'URL is required' 
      });
      return;
    }
    
    try {
      // Ensure we have a valid token
      const isAuthenticated = await authService.ensureValidToken();
      if (!isAuthenticated) {
        res.status(500).json({
          success: false,
          error: 'Failed to authenticate with Alai'
        });
        return;
      }
      
      // Step 1: Scrape the webpage
      const scrapedData = await scraperService.scrapeWebpage(url);
      console.log("Scraped Data in Controller:", scrapedData);
      
      // Step 2: Process the content
      const processedContent = contentService.processContent(scrapedData);
      
      // Step 3: Create the presentation
      const presentationUrl = await presentationService.createPresentation(processedContent);
      
      // Return the presentation URL
      res.json({
        success: true,
        data: {
          presentationUrl
        }
      });
    } catch (error) {
      console.error('Error in conversion process:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  }
}

export default new PresentationController();