import * as cheerio from 'cheerio';
import { ProcessedContent, ScrapedData, ImageData } from '../types';

class ContentService {
  /**
   * Process scraped webpage content into presentation-ready format
   */
  processContent(scrapedData: ScrapedData): ProcessedContent {
    
    const $ = cheerio.load(scrapedData.html);
    
    // Extract title
    const title = $('title').text() || 'Web Page Presentation';
    
    // Extract main content
    const mainContent = $('main, article, #content, .content, body').first();
    
    // Extract headings, paragraphs, and images
    const headings: string[] = [];
    const paragraphs: string[] = [];
    const images: ImageData[] = [];
    
    // Get headings
    mainContent.find('h1, h2, h3').each((i, el) => {
      const text = $(el).text().trim();
      if (text) headings.push(text);
    });
    
    // Get paragraphs
    mainContent.find('p').each((i, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 50) paragraphs.push(text); // Only substantial paragraphs
    });
    
    // Get images
    mainContent.find('img').each((i, el) => {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt') || '';
      if (src && !src.includes('logo') && !src.includes('icon')) {
        // Convert relative URLs to absolute
        const absoluteSrc = new URL(src, scrapedData.url).href;
        images.push({ src: absoluteSrc, alt });
      }
    });
    
    // Create slides structure
    const slides = [];
    
    // Slide 1: Title slide
    slides.push({
      type: 'title',
      content: {
        title: title.substring(0, 100),
        subtitle: `Source: ${scrapedData.url}`
      }
    } as const);
    
    // Slide 2: Overview slide with key points
    const keyPoints = headings.slice(0, 3);
    slides.push({
      type: 'bullets',
      content: {
        title: 'Key Highlights',
        bullets: keyPoints.length > 0 ? keyPoints : ['Overview of website content', 'Key information', 'Main takeaways']
      }
    } as const);
    
    // Add content slides (3-4 slides)
    const MAX_CONTENT_SLIDES = 3;
    for (let i = 0; i < Math.min(MAX_CONTENT_SLIDES, headings.length); i++) {
      if (i < paragraphs.length) {
        slides.push({
          type: 'content',
          content: {
            title: headings[i] || `Key Point ${i+1}`,
            text: paragraphs[i].substring(0, 300) + (paragraphs[i].length > 300 ? '...' : '')
          }
        } as const);
      }
    }
    
    // Add image slide if available
    if (images.length > 0) {
      slides.push({
        type: 'image',
        content: {
          title: 'Visual Content',
          imageUrl: images[0].src,
          caption: images[0].alt || 'Image from the webpage'
        }
      } as const);
    }

    console.log("Processed Slides:", slides);
    
    return {
      title,
      slides
    };
  }
}

export default new ContentService();