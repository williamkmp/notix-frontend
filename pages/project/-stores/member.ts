import type { MemberDto } from '~/types';

export const useProjectMemberStore = defineStore('ProjectMemberStore', () => {
    const list = ref<MemberDto[]>([]);

    return { list };
});
