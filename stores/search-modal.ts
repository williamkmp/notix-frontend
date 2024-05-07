import { defineStore } from 'pinia';

export const useSearchModalStore = defineStore('SearchModal', () => {
    const isOpen = ref(false);
    return {
        isOpen,
    };
});
