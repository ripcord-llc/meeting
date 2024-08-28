import { mutate } from 'swr';

export const CONFIG = {
  CLIENT_URL: process.env.CLIENT_URL, // Replace with env variable
  API_URL: process.env.API_URL, // Replace with env variable
};

export function setConfig({ clientUrl, apiUrl }: { clientUrl: string; apiUrl: string }) {
  CONFIG.CLIENT_URL = clientUrl;
  CONFIG.API_URL = apiUrl;

  mutate(() => true, undefined, { revalidate: false }); // Revalidate all SWR hooks if config changes
}

export { default as ConfigurationProvider } from './config-provider';
