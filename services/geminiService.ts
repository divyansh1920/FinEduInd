import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists to prevent immediate crash, handle error gracefully in UI
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateTutorResponse = async (
  userMessage: string, 
  history: { role: string; text: string }[]
): Promise<string> => {
  if (!ai) {
    return "API Key is missing. Please check your environment configuration.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    // Construct a context-aware prompt
    const systemInstruction = `
      You are an expert Indian Financial Educator and Advisor. 
      Your goal is to explain financial concepts (Stocks, Bonds, Mutual Funds, Derivatives, Taxes) specifically in the Indian context (using Indian currency, Indian market examples like Nifty, Sensex, SEBI rules).
      
      Guidelines:
      1. Keep explanations simple, engaging, and easy to understand for a beginner.
      2. Use analogies.
      3. If asked about specific advice, provide educational content but add a disclaimer that you are an AI and this is not financial advice.
      4. Format your response with clear paragraphs or bullet points where necessary.
    `;

    // Convert history to a string context or just use the current message with system instruction
    // For a simple chat, we'll send the prompt directly with instruction.
    // In a real app, we might use ai.chats.create() for history management.
    
    // Let's use the simple generateContent with system instruction for this interaction.
    // We will concatenate recent history to the prompt manually to keep it stateless here or use the chat API.
    // Let's use the Chat API for better conversation flow.
    
    // Create a new chat instance for this turn (simulated statelessness for service function, 
    // but typically you'd keep the chat object alive in the component. 
    // Here we will use generateContent for simplicity with the full context passed as text if needed, 
    // but the prompt asked for "interactive". Let's assume single-turn detailed explanations for now 
    // or simulate history in the prompt).
    
    // Better approach for this demo:
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        { role: 'user', parts: [{ text: `Context: The user is learning about Indian Finance.\nHistory: ${JSON.stringify(history.slice(-3))}\n\nUser Question: ${userMessage}` }] }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't generate a response at this moment.";
  } catch (error) {
    console.error("Error generating content:", error);
    return "I encountered an error while trying to answer your question. Please try again.";
  }
};