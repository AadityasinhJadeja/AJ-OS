
import { GoogleGenAI } from "@google/genai";
import { DailyEntry, Idea, WeeklyOutcome } from "./types";
import { GEMINI_API_KEY, isGeminiConfigured } from "../config";

const getAIClient = () => {
  if (!isGeminiConfigured()) {
    throw new Error("Gemini API key not configured");
  }
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
};

export const AIService = {
  generateWeeklyReview: async (
    logs: DailyEntry[],
    outcomes: WeeklyOutcome,
    ideas: Idea[]
  ): Promise<string> => {
    try {
      const ai = getAIClient();
      const prompt = `
          As AJ-26 OS, generate a brutal Weekly Summary based on the following data:
          
          DAILY LOGS:
          ${JSON.stringify(logs)}
    
          WEEKLY OUTCOMES:
          ${JSON.stringify(outcomes)}
    
          IDEA INBOX ACTIVITY:
          ${JSON.stringify(ideas)}
    
          Follow EXACTLY this structure:
          What moved progress forward:
          What was busywork:
          Repeated distractions:
          Avoided discomfort:
          Patterns detected:
          One system adjustment for next week:
    
          TONE: Neutral, Analytical, Blunt. No praise unless backed by hard evidence.
        `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      return response.text || 'Failed to generate review.';
    } catch (e) {
      console.warn('AI Service Error:', e);
      return 'AI Insight unavailable. Please check your configuration.';
    }
  },

  generateInsights: async (
    logs: DailyEntry[],
    ideas: Idea[],
    outcomes: WeeklyOutcome[]
  ): Promise<string> => {
    try {
      const ai = getAIClient();
      const prompt = `
          Analyze the behavioral patterns of the user over the last 30 days.
          Data provided:
          Logs: ${JSON.stringify(logs)}
          Ideas: ${JSON.stringify(ideas)}
          Outcomes: ${JSON.stringify(outcomes)}
    
          Output 3 specific, evidence-based insights (e.g., "You generate 4x more ideas than you execute").
          Be blunt. No sugarcoating.
        `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });

      return response.text || 'No patterns detected.';
    } catch (e) {
      console.warn('AI Service Error:', e);
      return 'AI Insights unavailable.';
    }
  }
};
