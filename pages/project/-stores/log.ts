import type { LogDto, SubprojectDto } from '~/types';

export const useProjectLogStore = defineStore('ProjectLogStore', () => {
    const list = ref<LogDto[]>([]);
    const offset = computed(() => list.value.length);
    const size = 5;

    return {
        list,
        offset,
        size,
    };
});
