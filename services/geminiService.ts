
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeCrisisSentiment(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the mental health crisis level of the following text on a scale of 0 to 100, where 100 is an immediate life-threatening crisis and 0 is complete emotional stability. Consider intent, hopelessness, and severity. Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: "The crisis risk score from 0-100",
            },
            summary: {
              type: Type.STRING,
              description: "A short summary of the sentiment",
            }
          },
          required: ["score", "summary"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as { score: number; summary: string };
  } catch (error) {
    console.error("Sentiment analysis failed", error);
    return { score: 50, summary: "Error analyzing sentiment" };
  }
}
