export const usePageLoadingStore = defineStore('ProjectPageLoading', () => {
    const isLoading = ref(true);

    return {
        isLoading,
    };
});
