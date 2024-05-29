<script setup lang="ts">
import type { StompSubscription } from '@stomp/stompjs';
import PreviewItem from './preview-item.vue';
import PreviewItemSekeleton from './preview-item-skeleton.vue';
import PreviewItemEmpty from './preview-item-empty.vue';
import type { PreviewActionDto, PreviewDto } from '~/types';

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
const subprojectPreviews = ref<PreviewDto[]>([]);

const isSubprojectEmpty = computed(() => subprojectPreviews.value.length <= 0);

function toggleOpen() {
    isOpen.value = !isOpen.value;
    if (!isChildrenLoaded.value)
        fetchPreview();
}

async function fetchPreview() {
    const subprojectId = props.subproject.id;
    // TODO: impelemnt this
    isChildrenLoaded.value = true;
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
        :is-open="isOpen" :lable="name" @toggle-open="toggleOpen"
        @do-navigate="navigateTo(`/subproject/${$props.subproject.id}`)"
    />
    <template v-if="isOpen">
        <div class="flex w-full flex-col gap-1 pl-6">
            <template v-if="isChildrenLoaded">
                <PreviewItemEmpty />
            </template>
            <template v-else>
                <PreviewItemSekeleton />
            </template>
        </div>
    </template>
</template>
