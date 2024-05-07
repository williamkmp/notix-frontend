import { useStorage } from '@vueuse/core';

export const useSideMenuStore = defineStore('GlobalSideMenu', () => {
    const isOpen = useStorage<boolean>('NOTIX_SIDEMENU_ISOPEN', true);
    const size = useStorage<number>('NOTIX_SIDEMENU_SIZE', 300);

    function toggleOpen() {
        isOpen.value = !isOpen.value;
    }

    return {
        isOpen,
        size,
        toggleOpen,
    };
});
