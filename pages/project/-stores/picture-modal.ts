export const useProjectPictureModalStore = defineStore('ProjectPictureModal', () => {
    const isOpen = ref(false);
    const isSubmitting = ref(false);

    function reset() {
        isOpen.value = false;
        isSubmitting.value = false;
    }

    return {
        isOpen,
        isSubmitting,
        reset,
    };
});
