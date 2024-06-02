<script lang="ts" setup>
defineProps<{
    disabled?: boolean;
    loading?: boolean;
}>();
const model = defineModel<string>();
const isFocus = ref(false);
</script>

<template>
    <div class="flex w-full items-center">
        <template v-if="!$props.loading">
            <UInput
                v-model="model"
                :disabled="$props.disabled"
                size="xs"
                class="w-full rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
                :ui="{ size: { xs: 'text-sm' } }"
                :variant="isFocus ? 'outline' : 'none'"
                placeholder="-"
                @focus="isFocus = true"
                @blur="isFocus = false"
            />
        </template>
        <template v-else>
            <USkeleton class="my-0.5 h-7 w-full rounded-md" />
        </template>
    </div>
</template>
