
import { GoogleGenAI } from "@google/genai";
import { CharmType } from "./types";

// Constants from Charms Documentation
export const STUDIO_VK = "8e877d70518a5b28f5221e70bd7ff7692a603f3a26d7076a5253e21c304a354f";
export const MOCK_UTXO = "d8fa4cdade7ac3dff64047dc73b58591ebe638579881b200d4fea68fc84521f0:0";
export const OWNER_ADDR = "tb1p3w06fgh64axkj3uphn4t258ehweccm367vkdhkvz8qzdagjctm8qaw2xyv";

// Utility to generate SHA-256 Hash
export async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate a random hex string of specified length
export const randomHex = (bytes: number) => {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Forge a new charm by invoking the Gemini Reasoning Engine.
 * This function handles API call and transforms grounding metadata into the expected application format.
 */
export const forgeCharm = async (prompt: string, onProgress?: (step: string) => void) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  onProgress?.("Invoking Pro Reasoning Engine...");
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { 
      thinkingConfig: { thinkingBudget: 4000 },
      tools: [{ googleSearch: {} }] 
    }
  });

  // Extract and format grounding chunks to match the Charm interface's sources property
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = chunks
    .filter(chunk => chunk.web)
    .map(chunk => ({
      web: {
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Source'
      }
    }));

  return { 
    content: response.text || '', 
    sources
  };
};
