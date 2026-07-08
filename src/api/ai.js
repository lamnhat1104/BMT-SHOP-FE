import { fetchData } from './config';

export const aiApi = {
  chat: async (message) => {
    return fetchData('/v1/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
};
