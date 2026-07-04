import { fetchData } from './config';

export const homeApi = {
  getHomeData: async () => {
    return fetchData('/home', {
      method: 'GET',
    });
  }
};
