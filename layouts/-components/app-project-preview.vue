<script setup lang="ts">
import type { StompSubscription } from '@stomp/stompjs';
import PreviewItem from './preview-item.vue';
import type { PreviewActionDto, PreviewDto } from '~/types';

const props = defineProps<{
    project: PreviewDto;
}>();

const emit = defineEmits<{
    deleted: [project: PreviewDto];
}>();

const isOpen = ref(false);
const subscribtion = ref<StompSubscription>();
const socket = useSocketClientStore();

const name = ref(props.project.name);
const imageId = ref(props.project.imageId);

function toggleOpen() {
    isOpen.value = !isOpen.value;
}

onMounted(async () => {
    subscribtion.value = socket.subscribe(`/topic/project/${props.project.id}/preview`, (payload: PreviewActionDto) => {
        if (payload.action === 'UPDATE_SELF') {
            name.value = payload.name;
            imageId.value = payload.imageId;
        }
        else if (payload.action === 'DELETE_SELF') {
            emit('deleted', props.project);
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
        :is-open="isOpen"
        :lable="name"
        :level="0"
        :redirect-url="`/project/${props.project.id}`"
        @toggle-open="toggleOpen"
        @do-navigate="navigateTo(`/project/${$props.project.id}`)"
    />
</template>
