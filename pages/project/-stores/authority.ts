import type { USER_ROLE } from '~/types';

export const useAuthorityStore = defineStore('ProjectAuthorityStore', () => {
    const role = ref<USER_ROLE>('VIEWER');

    function setRole(newRole: USER_ROLE) {
        role.value = newRole;
    }

    const userCanUpdateHeader = computed(() => role.value === 'PROJECT_MANAGER');
    const userCanOpearteSubProject = computed(() => role.value === 'PROJECT_MANAGER');
    const userCanOpearteMember = computed(() => role.value === 'PROJECT_MANAGER');

    return {
        setRole,
        role: readonly(role),
        userCanUpdateHeader,
        userCanOpearteSubProject,
        userCanOpearteMember,
    };
});
