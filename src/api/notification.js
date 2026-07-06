import { fetchData } from './config';

export const notificationApi = {
    getMyNotifications: () => {
        return fetchData('/notifications');
    },

    markAsRead: (id) => {
        return fetchData(`/notifications/${id}/read`, { method: 'PUT' });
    },

    markAllAsRead: () => {
        return fetchData('/notifications/read-all', { method: 'PUT' });
    }
};
