import axios from 'axios';
import authService from './authService';
import { ProcessedContent } from '../types';
import { v4 as uuidv4 } from 'uuid';

class PresentationService {
  async createPresentation(content: ProcessedContent): Promise<string> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) throw new Error('Not authenticated with Alai');

    try {
      // Step 1: Create a new presentation
      const createRes = await axios.post(
        `https://alai-standalone-backend.getalai.com/create-new-presentation`,
        {
          presentation_id: uuidv4(),
          presentation_title: content.title || 'Untitled Presentation',
          theme_id: 'a6bff6e5-3afc-4336-830b-fbc710081012',
          default_color_set_id: 0,
          create_first_slide: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const presentationId = createRes.data.presentationId || createRes.data.id;

      // Step 2: Get the presentation questions
      await axios.get(
        `https://alai-standalone-backend.getalai.com/get-presentation-questions/${presentationId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Step 3: Extract raw text from slides to send as raw_context
      const rawText = content.slides.map(slide => {
        const contentObj = slide.content;
        switch(slide.type) {
          case 'title':
            return `${contentObj.title || ''}\n${contentObj.subtitle || ''}`;
          case 'bullets':
            return `${contentObj.title || ''}\n${contentObj.bullets ? contentObj.bullets.join('\n') : ''}`;
          case 'content':
            return `${contentObj.title || ''}\n${contentObj.text || ''}`;
          case 'image':
            return `${contentObj.title || ''}\n${contentObj.caption || ''}`;
          default:
            return JSON.stringify(contentObj);
        }
      }).join('\n\n');

      // Step 4: Ingest scraped data 
      await axios.post(
        `https://alai-standalone-backend.getalai.com/get-calibration-sample-text`,
        {
          presentation_id: presentationId,
          raw_context: rawText,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Step 5: Generate shareable token
      const shareRes = await axios.post(
        `https://alai-standalone-backend.getalai.com/upsert-presentation-share`,
        { presentation_id: presentationId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const token = shareRes.data;
      
      const shareableUrl = `https://app.getalai.com/view/${token}`;

      return shareableUrl;
    } catch (error: any) {
      console.error(' Error in presentation flow:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new PresentationService();