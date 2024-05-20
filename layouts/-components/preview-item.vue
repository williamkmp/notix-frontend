<script setup lang="ts">
const props = defineProps<{
    lable: string;
    level: number;
    redirectUrl: string;
    isLeaf?: boolean;
    isOpen: boolean;
    imageId?: string;
}>();

defineEmits<{
    toggleOpen: [];
    doNavigate: [];
}>();

const imageUrl = computed(() => {
    if (props.imageId) {
        const baseURL = useRuntimeConfig().public.API_BASE_URL;
        return `${baseURL}api/file/${props.imageId}`;
    }
    return undefined;
});
</script>

<template>
    <div class="group flex w-full shrink-0 select-none items-center justify-start rounded-md text-sm font-medium  text-gray-600 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-950 dark:hover:text-white">
        <template v-if="props.isLeaf">
            <UButton
                icon="i-ep-arrow-right-bold"
                class="opacity-0"
                size="2xs"
            />
        </template>
        <template v-else>
            <UButton
                icon="i-ep-arrow-right-bold"
                variant="ghost" color="gray"
                class="transition-transform"
                :class="[$props.isOpen ? 'rotate-90' : 'rotate-0']"
                size="2xs" @click="$emit('toggleOpen')"
            />
        </template>

        <div class="flex size-full items-center gap-2 truncate" @click="$emit('doNavigate')">
            <template v-if="imageUrl">
                <UAvatar size="xs" :src="imageUrl" />
            </template>
            <template v-else>
                <UIcon name="i-heroicons-folder-solid" class="ml-1.5 shrink-0 text-lg" />
            </template>
            <span class="truncate text-sm font-medium">
                {{ $props.lable.trim() !== '' ? $props.lable.trim() : 'Untitled' }}
            </span>
        </div>
    </div>
</template>
