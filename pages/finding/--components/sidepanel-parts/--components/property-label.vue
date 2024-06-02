<script lang="ts" setup>
defineProps<{
    label: string;
    loading: boolean;
    icon?: string;
}>();
</script>

<template>
    <div class="size-full">
        <template v-if="!$props.loading">
            <div class="flex size-full items-center gap-2 opacity-60">
                <UIcon dynamic class="text-sm" :name="$props.icon ?? 'i-heroicons-bars-3-bottom-left'" />
                <span class="text-sm">{{ $props.label }}</span>
            </div>
        </template>
        <template v-else>
            <USkeleton class="my-0.5 h-7 w-full rounded-md" />
        </template>
    </div>
</template>
