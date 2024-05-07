import type { InviteDto, USER_ROLE } from '~/types';

export const useProjectInviteModalStore = defineStore('ProjectInviteModal', () => {
    const isOpen = ref(false);
    const isSubmitting = ref(false);
    const invites = ref<InviteDto[]>([]);

    const isInvitesEmpty = computed(() => invites.value.length <= 0);

    function addInvite(email: string) {
        const isInviteExist = invites.value.some(invite => invite.email === email);
        if (isInviteExist)
            return;
        invites.value.unshift({
            email,
            role: 'VIEWER',
        });
    }

    function updateInviteRoleAt(index: number, role: USER_ROLE) {
        invites.value[index].role = role;
    }

    function removeInviteAt(index: number) {
        invites.value.splice(index, 1);
    }

    function reset() {
        isOpen.value = false;
        isSubmitting.value = false;
        invites.value = [];
    }

    return {
        invites,
        isOpen,
        isSubmitting,
        isInvitesEmpty,
        addInvite,
        updateInviteRoleAt,
        removeInviteAt,
        reset,
    };
});
