import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
}

export const generateSenseiFeedback = async (score: number, slicedCount: number, bombHit: boolean) => {
  const ai = getClient();
  if (!ai) {
    return "Focus is broken. API key missing.";
  }

  const prompt = `
    I played a minimalist slicing game.
    Score: ${score}.
    Targets sliced: ${slicedCount}.
    Bomb triggered: ${bombHit ? "Yes" : "No"}.
    
    Act as a Zen Master of Minimalism and Design.
    Provide a cryptic, haiku-like, or deeply philosophical 1-2 sentence assessment.
    Focus on efficiency, void, and form.
    If bomb hit: lament the disruption of peace.
    If high score: praise the flow state.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "The void stares back.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Silence in the network.";
  }
};