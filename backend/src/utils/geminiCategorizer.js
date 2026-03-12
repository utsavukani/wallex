import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini SDK
// Note: You must have GEMINI_API_KEY in your .env file
const ai = new GoogleGenAI({});

export const categorizeTransaction = async (transaction) => {
  const { merchant = '', note = '', amount } = transaction;

  try {
    const prompt = `
      You are an expert financial transaction categorizer.
      Please categorize the following transaction into the most accurate, concise, broad category possible (e.g., 'Groceries', 'Electronics', 'Personal Care', 'Sports', 'Utilities', 'Education', etc.). Do not restrict yourself to a predefined list.
      
      Transaction Details:
      - Merchant/Title: ${merchant}
      - Note/Description: ${note}
      - Spend Amount in INR: ${amount}
      
      Determine the best high-level category and provide a confidence score from 0.0 to 1.0 based on how certain you are.
      Determine a short highly-specific subCategory.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.1,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    category: {
                        type: Type.STRING,
                        description: "A concise, appropriate 1-2 word broad financial category."
                    },
                    confidence: {
                        type: Type.NUMBER,
                        description: "Float between 0.0 and 1.0"
                    },
                    subCategory: {
                        type: Type.STRING,
                        description: "A short specific sub-category word"
                    }
                },
                required: ["category", "confidence", "subCategory"]
            }
        }
    });

    const result = JSON.parse(response.text);
    return {
        category: result.category,
        confidence: Math.round(result.confidence * 100) / 100,
        subCategory: result.subCategory || ''
    };

  } catch (error) {
    console.error("Gemini Categorization Error:", error);
    // Fallback to "Other" safely if AI fails (e.g., API key missing or rate limit)
    return {
        category: "Other",
        confidence: 0.1,
        subCategory: "Unknown"
    };
  }
};
