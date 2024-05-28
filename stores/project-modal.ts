import { defineStore } from 'pinia';
import type { InviteDto, PROJECT_ROLE, USER_ROLE } from '~/types';

export const useProjectModalStore = defineStore('ProjectModal', () => {
    const dayjs = useDayjs();
    const isOpen = ref(false);
    const isSubmitting = ref(false);

    const form = reactive<{
        title: string;
        invites: InviteDto[];
        range: {
            start: Date;
            end: Date;
        };
    }>({
        title: '',
        invites: [],
        range: {
            start: dayjs().startOf('day').toDate(),
            end: dayjs().startOf('day').add(1, 'day').toDate(),
        },
    });

    const error = reactive<{
        title?: string;
        range?: string;
    }>({});

    const isMembersEmpty = computed(() => form.invites.length <= 0);

    function addEmail(email: string) {
        const emailExist = form.invites.some(invite => invite.email === email);
        if (!emailExist) {
            form.invites.unshift({
                email,
                role: 'MEMBER',
            });
        }
    }

    function updateRoleAt(index: number, role: PROJECT_ROLE) {
        form.invites[index].role = role;
    }

    function removeInviteAt(index: number) {
        form.invites.splice(index, 1);
    }

    function reset() {
        isSubmitting.value = false;
        error.range = undefined;
        error.title = undefined;
        form.title = '';
        form.invites = [];
        form.range.start = dayjs().startOf('day').toDate();
        form.range.end = dayjs().startOf('day').add(1, 'day').toDate();
    }

    return {
        isOpen,
        isSubmitting,
        form,
        error,
        isMembersEmpty,
        reset,
        addEmail,
        removeInviteAt,
        updateRoleAt,
    };
});
