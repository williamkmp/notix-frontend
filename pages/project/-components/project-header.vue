<script setup lang="ts">
import { usePageLoadingStore } from '../-stores/page-loading';
import { useProjectStore } from '../-stores/project';
import { useAuthorityStore } from '../-stores/authority';
import { useProjectPictureModalStore } from '../-stores/picture-modal';
import type { ServerData, UserDto } from '~/types';

const authority = useAuthorityStore();
const pageLoading = usePageLoadingStore();
const projectPictureModal = useProjectPictureModalStore();

const dayjs = useDayjs();
const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
const project = useProjectStore();
const api = usePrivateApi();

const isFocused = ref(false);
const activePeriode = computed({
    get: () => {
        return {
            start: project.startDate.toDate(),
            end: project.endDate.toDate(),
        };
    },
    set: (newPeriode) => {
        project.startDate = dayjs(newPeriode.start).startOf('day');
        project.endDate = dayjs(newPeriode.end).endOf('day');
    },
});

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

const ownerImageUrl = computed(() => owner.value?.imageId !== undefined
    ? `${BASE_URL}/api/file/${owner.value.imageId}`
    : undefined,
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
    <template v-if="!pageLoading.isLoading">
        <header class="flex items-end gap-4">
            <template v-if="authority.userCanUpdateHeader">
                <div class="rounded-lg  transition hover:bg-gray-400/20" @click="openPictureModal">
                    <UAvatar :src="project.imageUrl" icon="i-heroicons-photo" size="3xl" />
                </div>
            </template>
            <template v-else>
                <UAvatar :src="project.imageUrl" icon="i-heroicons-photo" size="3xl" />
            </template>
            <UInput
                v-model="project.title" :disabled="!authority.userCanUpdateHeader" :rows="1" placeholder="Untitled"
                autoresize :variant="isFocused ? 'outline' : 'none'" class="mb-1 w-full font-extrabold transition"
                :class="{ 'hover:bg-gray-200 dark:hover:bg-gray-600': authority.userCanUpdateHeader }" size="xl" :ui="{
                    size: { xl: 'text-4xl tracking-wide' },
                    padding: { xl: 'px-2 py-1' },
                    base: 'disabled:cursor-not-allowed disabled:opacity-100 ',
                }" @focus="isFocused = true" @blur="isFocused = false"
            />
        </header>
        <UDivider />
        <UCard class="mt-2">
            <section class="grid w-full grid-cols-[200px_1fr] gap-4 px-2">
                <div class="flex w-full items-center justify-between text-base font-medium opacity-80">
                    <span>Project Status</span>
                    <span>:</span>
                </div>
                <div class="flex w-full items-center">
                    <UBadge :color="project.isActive ? 'green' : 'red'" variant="subtle">
                        {{ project.isActive ? 'Active' : 'Inactive' }}
                    </UBadge>
                </div>

                <div class="flex w-full items-center justify-between text-base font-medium opacity-80">
                    <span>Project Manager</span>
                    <span>:</span>
                </div>
                <div class="flex w-full items-center gap-2">
                    <template v-if="owner === undefined">
                        <USkeleton class="h-8 w-full max-w-96 rounded-md" />
                    </template>
                    <template v-else>
                        <UAvatar :src="ownerImageUrl" :alt="owner.fullName.toString()" size="xs" />
                        <span class="text-sm">{{ owner.fullName }}</span>
                    </template>
                </div>

                <div class="flex w-full items-center justify-between text-base font-medium opacity-80">
                    <span>Active Period</span>
                    <span>:</span>
                </div>
                <div class="flex w-full items-center">
                    <RangeDatePicker
                        v-model="activePeriode" variant="solid" :disabled="!authority.userCanUpdateHeader"
                        color="white"
                    />
                </div>

                <div class="flex w-full items-center justify-between text-base font-medium opacity-80">
                    <span>My Role</span>
                    <span>:</span>
                </div>
                <div class="flex w-full items-center">
                    <span class="text-sm">{{ myRole }}</span>
                </div>
            </section>
        </UCard>
    </template>
    <template v-else>
        <header class="flex items-end gap-4">
            <USkeleton class="size-20 shrink-0 rounded-full" />
            <USkeleton class="h-11 w-full rounded-lg" />
        </header>
        <UDivider />
        <USkeleton class="mt-2 h-44 w-full rounded-lg" />
    </template>
</template>
