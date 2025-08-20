
import { Company } from "../types";
import { OFFLINE_QUESTS, OFFLINE_INVESTMENT_NEWS } from '../constants';

// The response shape for a generated quest.
interface QuestResponse {
    text: string;
    reward: number;
}

/**
 * Returns a random quest from the predefined offline list after a short delay.
 * @returns A promise that resolves to a quest object.
 */
const getRandomOfflineQuest = async (): Promise<QuestResponse> => {
    // Simulate a small delay for better UX, so the loading animation is visible.
    await new Promise(resolve => setTimeout(resolve, 1200));
    const randomIndex = Math.floor(Math.random() * OFFLINE_QUESTS.length);
    return OFFLINE_QUESTS[randomIndex];
};

/**
 * Returns a random news snippet for a company from the predefined offline list.
 * @param company - The company to generate news for.
 * @returns A news string.
 */
const getRandomOfflineNews = (company: Company): string => {
    const randomIndex = Math.floor(Math.random() * OFFLINE_INVESTMENT_NEWS.length);
    const template = OFFLINE_INVESTMENT_NEWS[randomIndex];
    return template.replace('{companyName}', company.name);
};

/**
 * Generates a new quest for the player. This function now uses a predefined list of offline quests.
 * @returns A promise that resolves to a quest object.
 */
export const generateQuest = async (): Promise<QuestResponse> => {
    // This function is now completely offline.
    return await getRandomOfflineQuest();
};

/**
 * Generates a news snippet about an investment. This function now uses a predefined list of offline news snippets.
 * @param company - The company that was invested in.
 * @returns A promise that resolves to a news string.
 */
export const getInvestmentNews = async (company: Company): Promise<string> => {
    // Simulate a small delay for better UX, so the loading animation is visible.
    await new Promise(resolve => setTimeout(resolve, 500));
    // This function is now completely offline.
    return getRandomOfflineNews(company);
};
