import { mutate } from 'swr';

export const CONFIG = {
  CLIENT_URL: 'http://localhost:8081', // Replace with env variable
  API_URL: 'http://localhost:3000',
};

export function setConfig({ clientUrl, apiUrl }: { clientUrl: string; apiUrl: string }) {
  CONFIG.CLIENT_URL = clientUrl;
  CONFIG.API_URL = apiUrl;

  mutate(() => true, undefined, { revalidate: false }); // Revalidate all SWR hooks if config changes
}

export { default as ConfigurationProvider } from './config-provider';
