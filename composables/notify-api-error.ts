import type { ServerResponseError } from '~/types';

export function useNotifyApiError(error: any) {
    const notif = useNotification();
    if (error.status && error.message) {
        if (typeof error.status === 'number' && typeof error.message === 'string') {
            const response = error as ServerResponseError;
            if (response.message && response.status) {
                if (response.status >= 400 && response.status <= 499)
                    notif.warn({ message: response.message });
                else if (response.status >= 500 && response.status <= 599)
                    notif.error({ message: response.message });
                else if (response.status >= 200 && response.status <= 299)
                    notif.ok({ message: response.message });
            }
        }
    }
    console.error('Unotified error:', error);
}
