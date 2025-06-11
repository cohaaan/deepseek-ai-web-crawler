import * as SecureStore from 'expo-secure-store';

const API_KEY_STORAGE_KEY = 'groq_api_key';

export const setApiKey = async (apiKey: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(API_KEY_STORAGE_KEY, apiKey);
  } catch (error) {
    console.error('Error storing API key:', error);
    throw error;
  }
};

export const getApiKey = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error('Error retrieving API key:', error);
    return null;
  }
};

export const clearApiKey = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing API key:', error);
    throw error;
  }
};

export const hasApiKey = async (): Promise<boolean> => {
  try {
    const apiKey = await getApiKey();
    return apiKey !== null && apiKey.length > 0;
  } catch (error) {
    console.error('Error checking API key:', error);
    return false;
  }
};