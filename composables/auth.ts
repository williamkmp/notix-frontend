import type { LoginDto, ServerData } from '~/types';

export function useAuth() {
    const app = useAppStore();
    const api = usePublicApi();
    const socket = useSocketClientStore();

    // States
    const accessToken = computed(() => app.accessToken);
    const refreshToken = computed(() => app.refreshToken);
    const sessionId = computed(() => app.sessionId);

    async function doRefreshAuth(): Promise<boolean> {
        try {
            const response: ServerData<LoginDto> = await api.post(
                '/api/auth/refresh',
                {
                    refreshToken: refreshToken.value,
                },
            );
            app.user = response.data.user;
            app.accessToken = response.data.token.accessToken;
            app.refreshToken = response.data.token.refreshToken;
            return true;
        }
        catch (error) {
            console.error('[AUTH]: Refresh token failed', error);
            return false;
        }
    }

    async function doClearAuth(): Promise<void> {
        socket.deactivate();
        app.user = undefined;
        app.accessToken = 'INVALID_DEFAULT_TOKEN';
        app.refreshToken = 'INVALID_DEFAULT_TOKEN';
        await navigateTo('/login');
    }

    return {
        sessionId,
        accessToken,
        refreshToken,
        doRefreshAuth,
        doClearAuth,
    };
}
