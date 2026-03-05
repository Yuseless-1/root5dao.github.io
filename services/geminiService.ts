
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getProposalSummary = async (proposalText: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following DAO governance proposal in a short, bulleted list for a quick read: \n\n${proposalText}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing proposal:", error);
    return "Summary unavailable at this moment.";
  }
};

export const explainTreasuryImpact = async (assetData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the strategic importance of this treasury allocation for a Web3 DAO: ${JSON.stringify(assetData)}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error explaining treasury:", error);
    return "Analysis unavailable.";
  }
};
