import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: any;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async summarizeEmail(emailContent: string): Promise<string> {
    try {
        const prompt = `You are a highly efficient email assistant. Your task is to summarize the following email and extract key actions required from me.

        **Email:**

        ${emailContent}

        **Output Format:**

        **Summary:**
        [A concise, accurate summary of the email's main points. Limit to 3-5 sentences.]

        **Action Items:**
        * [Action 1: Clearly state the action required, including who is responsible and the deadline if mentioned. Be specific. e.g., "Reply to John Smith by Friday confirming the meeting time."]
        * [Action 2: (If applicable) Clearly state the action required...]
        * [Action 3: (If applicable) Clearly state the action required...]
        * [If no action items are found, state: "No action items required from me."]`;


      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      console.error('Error summarizing email:', error);
      throw new Error('Failed to summarize email content');
    }
  }
}