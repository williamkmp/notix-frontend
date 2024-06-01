<script setup lang="ts">
import type { StompSubscription } from '@stomp/stompjs';
import PreviewItem from './preview-item.vue';
import type { PreviewActionDto, PreviewDto } from '~/types';

const props = defineProps<{
    finding: PreviewDto;
}>();

const emit = defineEmits<{
    deleted: [finding: PreviewDto];
}>();

const subscribtion = ref<StompSubscription>();
const socket = useSocketClientStore();

const name = ref(props.finding.name);

onMounted(async () => {
    subscribtion.value = socket.subscribe(`/topic/finding/${props.finding.id}/preview`, (payload: PreviewActionDto) => {
        if (payload.action === 'UPDATE_SELF') {
            name.value = payload.name;
        }
        else if (payload.action === 'DELETE_SELF') {
            emit('deleted', props.finding);
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
        :lable="name" icon="i-heroicons-document-solid"
        @navigate="navigateTo(`/finding/${$props.finding.id}`)"
    >
        <template #leading>
            <UIcon name="i-heroicons-document-solid" class="my-0.5 text-lg" />
        </template>
    </PreviewItem>
</template>
