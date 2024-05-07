import type { SubprojectDto } from '~/types';

export const useProjectSubprojectStore = defineStore('ProjectSubprojectStore', () => {
    const dayjs = useDayjs();
    const list = ref<SubprojectDto[]>([
        {
            id: 'sb-1',
            name: 'Public file access',
            startDate: dayjs().add(1, 'week').toDate(),
            endDate: dayjs().subtract(1, 'week').toDate(),
        },
        {
            id: 'sb-2',
            name: 'Login & Authentication',
            startDate: dayjs().subtract(3, 'day').toDate(),
            endDate: dayjs().add(2, 'day').toDate(),
        },
        {
            id: 'sb-3',
            name: 'User role & access',
            startDate: dayjs().subtract(1, 'day').toDate(),
            endDate: dayjs().subtract(1, 'week').toDate(),
        },
    ]);

    return { list };
});
