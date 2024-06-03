<script lang="ts" setup>
defineProps<{
    disabled?: boolean;
}>();

defineEmits<{
    change: [value: string];
}>();

const model = defineModel<string>();
const isFocus = ref(false);
</script>

<template>
    <div class="flex w-full items-center">
        <UInput
            v-model="model"
            :disabled="$props.disabled"
            color="white"
            size="xs"
            class="w-full rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
            :ui="{ size: { xs: 'text-sm' } }"
            :variant="isFocus ? 'outline' : 'none'"
            placeholder="-"
            @change="(newValue: string) => $emit('change', newValue)"
            @focus="isFocus = true"
            @blur="isFocus = false"
        />
    </div>
</template>
