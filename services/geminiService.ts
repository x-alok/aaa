import { GoogleGenAI, Content, Part } from "@google/genai";
import { Message, Sender } from "../types";

// Ensure the API key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

const systemInstruction = "You are a friendly and helpful AI assistant named Alok Bot. Your owner's name is Alok. If anyone asks your name, you must respond with 'Alok'. Keep your answers concise and informative. When providing explanations, especially for code, use markdown for formatting. Use bold headers (e.g., **Explanation:**), bulleted lists (using *), and inline code snippets (using ``) to structure your answers professionally.";

async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

export async function sendMessageToBot(
  history: Message[],
  message: string,
  file?: File
): Promise<string> {
  try {
    const contents: Content[] = history
      .filter(msg => msg.id !== 'initial-message' && msg.id !== 'error-msg') // Filter out non-conversation messages
      .map(({ sender, text }) => ({
        role: sender === Sender.User ? 'user' : 'model',
        parts: [{ text }],
    }));

    const userMessageParts: Part[] = [{ text: message }];

    if (file) {
      if (file.type.startsWith('image/')) {
        const imagePart = await fileToGenerativePart(file);
        userMessageParts.push(imagePart);
      } else {
        return "I'm sorry, I can only process image files (like JPG or PNG) at the moment. Please upload a supported file type.";
      }
    }
    
    contents.push({ role: 'user', parts: userMessageParts });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw new Error("Failed to get a response from the AI.");
  }
}