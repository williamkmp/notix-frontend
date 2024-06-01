<script setup lang="ts">
const props = defineProps<{
    lable: string;
    toggleable?: boolean;
    isOpen?: boolean;
}>();

const emit = defineEmits<{
    toggle: [];
    navigate: [];
}>();

function onToggle(e: Event) {
    e.stopPropagation();
    emit ('toggle');
}
</script>

<template>
    <div
        class="group flex w-full shrink-0 select-none items-center gap-1 rounded-md py-1 pl-2 text-gray-600 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-950 dark:hover:text-white"
    >
        <div class="relative flex size-full items-center gap-2 truncate" @click="$emit('navigate')">
            <div class="flex items-center" :class="[props.toggleable ? 'group-hover:opacity-0' : '']">
                <slot name="leading" />
            </div>
            <template v-if="props.toggleable">
                <div class="absolute flex h-full items-center opacity-0 transition group-hover:opacity-100">
                    <UButton
                        size="2xs" variant="solid" color="gray" icon="i-ep-arrow-right-bold"
                        class="transition-transform" :class="[
                            $props.isOpen ? 'rotate-90' : 'rotate-0',
                        ]" @click="onToggle"
                    />
                </div>
            </template>
            <span class="truncate text-sm font-medium">
                {{ $props.lable.trim() !== '' ? $props.lable.trim() : 'Untitled' }}
            </span>
        </div>
    </div>
</template>
