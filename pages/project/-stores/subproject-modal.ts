export const useSubprojectModalStore = defineStore('ProjectSubprojectModalStore', () => {
    const dayjs = useDayjs();

    const isOpen = ref(false);
    const isLoading = ref(false);

    const form = reactive<{
        name: string;
        range: {
            start: Date;
            end: Date;
        };
    }>({
        name: '',
        range: {
            start: dayjs().startOf('day').toDate(),
            end: dayjs().startOf('day').add(1, 'day').toDate(),
        },
    });

    const error = reactive<{
        name?: string;
        range?: string;
    }>({
        name: undefined,
        range: undefined,
    });

    function reset() {
        isOpen.value = false;
        isLoading.value = false;
        form.name = '';
        form.range.start = dayjs().startOf('day').toDate();
        form.range.end = dayjs().startOf('day').add(1, 'day').toDate();
        error.name = undefined;
        error.range = undefined;
    }

    return {
        isOpen,
        isLoading,
        form,
        error,
        reset,
    };
});
