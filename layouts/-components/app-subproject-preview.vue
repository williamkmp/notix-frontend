<script setup lang="ts">
import type { StompSubscription } from '@stomp/stompjs';
import PreviewItem from './preview-item.vue';
import PreviewItemSekeleton from './preview-item-skeleton.vue';
import PreviewItemEmpty from './preview-item-empty.vue';
import FindingPreview from './app-finding-preview.vue';
import type { PreviewActionDto, PreviewDto, ServerData } from '~/types';

const props = defineProps<{
    subproject: PreviewDto;
}>();

const emit = defineEmits<{
    deleted: [subproject: PreviewDto];
}>();

const subscribtion = ref<StompSubscription>();
const socket = useSocketClientStore();
const api = usePrivateApi();

const name = ref(props.subproject.name);
const imageId = ref(props.subproject.imageId);
const isOpen = ref(false);
const isChildrenLoaded = ref(false);
const childrens = ref<PreviewDto[]>([]);

const isChildrenEmpty = computed(() => childrens.value.length <= 0);

function toggleOpen() {
    isOpen.value = !isOpen.value;
    if (!isChildrenLoaded.value)
        fetchChildren();
}

async function fetchChildren() {
    const subprojectId = props.subproject.id;
    const response: ServerData<PreviewDto[]> = await api.get(`/api/subproject/${subprojectId}/findings/preview`);
    childrens.value = response.data;
    isChildrenLoaded.value = true;
}

function deleteChildren(targetPreview: PreviewDto) {
    const targetIndex = childrens.value.findIndex(preview => preview.id === targetPreview.id);
    if (targetIndex >= 0)
        childrens.value.splice(targetIndex, 1);
}

onMounted(async () => {
    subscribtion.value = socket.subscribe(`/topic/subproject/${props.subproject.id}/preview`, (payload: PreviewActionDto) => {
        if (payload.action === 'UPDATE_SELF') {
            name.value = payload.name;
            imageId.value = payload.imageId;
        }
        else if (payload.action === 'DELETE_SELF') {
            emit('deleted', props.subproject);
        }
    });
});

onUnmounted(() => {
    if (subscribtion.value)
        subscribtion.value.unsubscribe();
});
</script>

<template>
    <PreviewItem
        :is-open="isOpen" :lable="name" toggleable @toggle="toggleOpen"
        @navigate="navigateTo(`/subproject/${$props.subproject.id}`)"
    >
        <template #leading>
            <UIcon name="i-heroicons-folder-solid" class="my-0.5 text-lg" />
        </template>
    </PreviewItem>
    <template v-if="isOpen">
        <div class="flex w-full flex-col pl-6">
            <template v-if="isChildrenLoaded">
                <template v-if="!isChildrenEmpty">
                    <FindingPreview
                        v-for="finding in childrens" :key="finding.id" :finding="finding"
                        @deleted="deleteChildren(subproject)"
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
