// Authentication types
export interface AlaiTokens {
    accessToken: string;
    refreshToken: string;
    lastRefresh: number;
  }
  
  // API Response types
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  export interface PresentationResponse {
    presentationUrl: string;
  }
  
  // Request types
  export interface ConvertRequest {
    url: string;
  }
  
  // Presentation types
  export interface ProcessedContent {
    title: string;
    slides: Slide[];
  }
  
  export interface Slide {
    type: 'title' | 'bullets' | 'content' | 'image';
    content: {
      title: string;
      subtitle?: string;
      text?: string;
      bullets?: string[];
      imageUrl?: string;
      caption?: string;
    };
  }
  
  // Scraping types
  export interface ScrapedData {
    url: string;
    html: string;
    metadata?: any;
  }
  
  export interface ImageData {
    src: string;
    alt: string;
  }