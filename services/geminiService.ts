
import { GoogleGenAI, Type } from "@google/genai";
import { Company } from "../types";
import { OFFLINE_QUESTS } from '../constants';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API features will be disabled. Using offline quests.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface QuestResponse {
    text: string;
    reward: number;
}

const getRandomOfflineQuest = (): QuestResponse => {
    const randomIndex = Math.floor(Math.random() * OFFLINE_QUESTS.length);
    return OFFLINE_QUESTS[randomIndex];
};

export const generateQuest = async (): Promise<QuestResponse> => {
    if (!process.env.API_KEY) {
        // Return a random offline quest if API key is not available
        return getRandomOfflineQuest();
    }

    try {
        const prompt = `You are a quest generator for a fun, pixelated pomodoro productivity game. Generate a single, simple, actionable quest that a user can complete in the real world. The quest should be encouraging and related to productivity, learning, or well-being. Keep the quest text under 15 words.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        text: {
                            type: Type.STRING,
                            description: "The description of the quest.",
                        },
                        reward: {
                            type: Type.INTEGER,
                            description: "The coin reward for completing the quest, between 10 and 50.",
                        },
                    },
                    required: ["text", "reward"],
                },
                temperature: 0.9,
                topP: 1,
                topK: 64,
            },
        });
        
        const jsonText = response.text.trim();
        const questData = JSON.parse(jsonText);

        if (typeof questData.text === 'string' && typeof questData.reward === 'number') {
            return questData;
        } else {
            console.error("Received invalid format from API:", questData);
            throw new Error("Invalid format from API");
        }

    } catch (error) {
        console.error("Error generating quest from API. Using offline fallback:", error);
        // Fallback to offline quest in case of an API error
        return getRandomOfflineQuest();
    }
};

export const getInvestmentNews = async (company: Company): Promise<string> => {
    if (!process.env.API_KEY) {
        return `A reliable source reports that ${company.name} is on the verge of a major breakthrough! Early investors are buzzing with excitement.`;
    }

    try {
        const prompt = `You are a financial news reporter in a fun, pixelated productivity game. Write a short, exciting, and slightly quirky news snippet (under 30 words) about an investment in "${company.name}". Their business is: "${company.description}".`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.8,
                topP: 1,
                topK: 64,
                maxOutputTokens: 60,
            },
        });
        
        const text = response.text;
        return text ? text.trim() : `Rumors are swirling around ${company.name}! Something big might be happening soon.`;

    } catch (error) {
        console.error("Error generating investment news:", error);
        return `Rumors are swirling around ${company.name}! Something big might be happening soon. It's the talk of the town.`;
    }
};
