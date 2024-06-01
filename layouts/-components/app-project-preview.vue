<script setup lang="ts">
import type { StompSubscription } from '@stomp/stompjs';
import PreviewItem from './preview-item.vue';
import PreviewItemSekeleton from './preview-item-skeleton.vue';
import PreviewItemEmpty from './preview-item-empty.vue';
import SubprojectPreview from './app-subproject-preview.vue';
import type { PreviewActionDto, PreviewDto, ServerData } from '~/types';

const props = defineProps<{
    project: PreviewDto;
}>();

const emit = defineEmits<{
    deleted: [project: PreviewDto];
}>();

const subscribtion = ref<StompSubscription>();
const socket = useSocketClientStore();
const api = usePrivateApi();

const name = ref(props.project.name);
const imageId = ref(props.project.imageId);
const isOpen = ref(false);
const isChildrenLoaded = ref(false);
const subprojectPreviews = ref<PreviewDto[]>([]);

const isSubprojectEmpty = computed(() => subprojectPreviews.value.length <= 0);
const imageUrl = computed(() => {
    if (imageId.value) {
        const baseURL = useRuntimeConfig().public.API_BASE_URL;
        return `${baseURL}api/file/${imageId.value}`;
    }
    return undefined;
});

function toggleOpen() {
    isOpen.value = !isOpen.value;
    if (!isChildrenLoaded.value)
        fetchPreview();
}

async function fetchPreview() {
    const projectId = props.project.id;
    const reponse: ServerData<PreviewDto[]> = await api.get(`/api/project/${projectId}/subprojects/preview`);
    subprojectPreviews.value = reponse.data;
    isChildrenLoaded.value = true;
}

onMounted(async () => {
    subscribtion.value = socket.subscribe(`/topic/project/${props.project.id}/preview`, (payload: PreviewActionDto) => {
        if (payload.action === 'UPDATE_SELF') {
            name.value = payload.name;
            imageId.value = payload.imageId;
        }
        else if (payload.action === 'ADD_CHILD') {
            subprojectPreviews.value.unshift({
                id: payload.id,
                name: payload.name,
                imageId: payload.imageId,
            });
        }
        else if (payload.action === 'DELETE_SELF') {
            emit('deleted', props.project);
        }
    });
});

function deleteChildren(targetPreview: PreviewDto) {
    const targetIndex = subprojectPreviews.value.findIndex(preview => preview.id === targetPreview.id);
    if (targetIndex >= 0)
        subprojectPreviews.value.splice(targetIndex, 1);
}

onUnmounted(() => {
    if (subscribtion.value)
        subscribtion.value.unsubscribe();
});
</script>

<template>
    <PreviewItem
        :is-open="isOpen" :lable="name" toggleable @toggle="toggleOpen"
        @navigate="navigateTo(`/project/${$props.project.id}`)"
    >
        <template #leading>
            <UAvatar size="xs" :src="imageUrl" icon="i-heroicons-folder" />
        </template>
    </PreviewItem>
    <template v-if="isOpen">
        <div class="flex w-full flex-col pl-6">
            <template v-if="isChildrenLoaded">
                <template v-if="!isSubprojectEmpty">
                    <SubprojectPreview
                        v-for="subproject in subprojectPreviews" :key="subproject.id"
                        :subproject="subproject" @deleted="deleteChildren(subproject)"
                    />
                </template>
                <template v-else>
                    <PreviewItemEmpty />
                </template>
            </template>
            <template v-else>
                <PreviewItemSekeleton />
            </template>
        </div>
    </template>
</template>
