import { useAuth } from '~/composables/auth';

export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuth();
    const isRefreshSuccess = await auth.doRefreshAuth();
    const socket = useSocketClientStore();

    // IF: route is for guest only
    if (
        to.path in {
            '/login': true,
            '/register': true,
        }
    ) {
        if (isRefreshSuccess)
            return navigateTo('/');
    }
    // IF: route is for user only
    else {
        if (!isRefreshSuccess) {
            auth.doClearAuth();
            return navigateTo('/login');
        }
        else {
            await socket.activate();
        }
    }
});
