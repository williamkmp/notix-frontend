<script setup lang="ts">
import { usePageLoadingStore } from '../-stores/page-loading';
import { useProjectStore } from '../-stores/project';
import { useAuthorityStore } from '../-stores/authority';
import { useProjectPictureModalStore } from '../-stores/picture-modal';
import type { ServerData, UserDto } from '~/types';

import VHeader from '~/components/v-header.vue';

const authority = useAuthorityStore();
const project = useProjectStore();
const pageLoading = usePageLoadingStore();
const projectPictureModal = useProjectPictureModalStore();

const dayjs = useDayjs();

const api = usePrivateApi();



const activePeriode = computed({
    get: () => {
        return {
            start: project.startDate?.toDate(),
            end: project.endDate?.toDate(),
        };
    },
    set: (newPeriode) => {
        project.startDate = dayjs(newPeriode.start).startOf('day');
        project.endDate = dayjs(newPeriode.end).endOf('day');
    },
});

const userCanEditActivePeriode = computed(() => authority.userCanUpdateHeader);

const owner = ref<UserDto>();
watchImmediate(
    () => project.ownerId,
    async (ownerId) => {
        if (ownerId === undefined)
            return;
        owner.value = undefined;
        try {
            const response: ServerData<UserDto> = await api.get(`/api/user/${ownerId}`);
            owner.value = response.data;
        }
        catch (error) {
            console.error('error loading project owner', error);
        }
    },
);



const myRole = computed(() => {
    const role = authority.role;
    switch (role) {
        case 'DEVELOPER':
            return 'Developer';
        case 'PENETRATION_TESTER':
            return 'Tester';
        case 'TECHNICAL_WRITER':
            return 'Writer';
        case 'PROJECT_MANAGER':
            return 'Project Manager';
        default:
            return 'Viewer';
    }
});

function openPictureModal() {
    projectPictureModal.isOpen = true;
}
</script>

<template>
    <VHeader 
        :loading="pageLoading.isLoading"
        :user-can-update-header="authority.userCanUpdateHeader"
        :on-click-picture-modal="openPictureModal"
        :image-url="project.imageUrl"
        v-model:title="project.title"
        :user-can-edit-active-periode="userCanEditActivePeriode"
        :is-active="project.isActive"
        :owner="owner"
        :my-role="myRole"
        v-model:range="activePeriode"
    />
</template>
