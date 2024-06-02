<script lang="ts" setup>
import type { PropertyOption } from '~/types';

defineProps<{
    options: Array<PropertyOption>;
    disabled?: boolean;
    loading?: boolean;
}>();
defineEmits<{
    change: [obj: PropertyOption];
}>();
const model = defineModel<string>();
const isFocus = ref(false);
</script>

<template>
    <div class="flex size-full items-center">
        <template v-if="!$props.loading">
            <USelectMenu
                :model-value="model"
                :disabled="$props.disabled"
                size="xs"
                class="w-full rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                :ui="{ size: { xs: 'text-sm' } }"
                :options="$props.options"
                option-attribute="label"
                :variant="isFocus ? 'outline' : 'none'"
                placeholder="-"
                trailing-icon=""
                @open="isFocus = true"
                @close="isFocus = false"
                @update:model-value="(e: PropertyOption) => { model = e.value }"
                @change="(e) => $emit('change', e)"
            />
        </template>
        <template v-else>
            <USkeleton class="my-0.5 h-7 w-full rounded-md" />
        </template>
    </div>
</template>
