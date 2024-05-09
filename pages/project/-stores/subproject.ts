import type { SubprojectData, SubprojectDto } from '~/types';

export const useProjectSubprojectStore = defineStore('ProjectSubprojectStore', () => {
    const dayjs = useDayjs();
    const list = ref<SubprojectData[]>([]);

    function setSubprojectList(dtoList: SubprojectDto[]) {
        list.value = dtoList.map((dto) => {
            return {
                id: dto.id,
                projectId: dto.projectId,
                name: dto.name,
                startDate: dayjs(dto.startDate).startOf('day'),
                endDate: dayjs(dto.endDate).endOf('day'),
            };
        });
    }

    return {
        list,
        setSubprojectList,
    };
});
