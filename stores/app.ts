import { v4 as uuid } from 'uuid';
import { useStorage } from '@vueuse/core';
import type { UserDto } from '~/types';
import { titleCase } from '~/utils/titleCase';

export const useAppStore = defineStore('GlobalApp', () => {
    const user = ref<UserDto>();
    const sessionId = ref<string>(uuid());
    const accessToken = ref<string>('INVALID_DEFAULT_TOKEN');
    const refreshToken = useStorage<string>(useRuntimeConfig().public.REFRESH_TOKEN_KEY, 'INVALID_DEFAULT_TOKEN');
    const isDark = computed({
        get: () => useColorMode().value === 'dark',
        set: (value: boolean) => useColorMode().preference = value ? 'dark' : 'light',
    });

    const userImageUrl = computed(() => {
        const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
        if (user.value === undefined || user.value.imageId === undefined)
            return undefined;
        return encodeURI(`${BASE_URL}api/file/${user.value.imageId}`);
    });

    const userFullName = computed(() => {
        if (user.value === undefined)
            return 'Anonymous';
        return titleCase(user.value.fullName);
    });

    return {
        user,
        isDark,
        sessionId,
        accessToken,
        refreshToken,
        userImageUrl,
        userFullName,
    };
});
