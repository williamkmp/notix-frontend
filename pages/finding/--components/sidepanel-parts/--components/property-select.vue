<script lang="ts" setup>
import type { PropertyOption } from '~/types';

const props = defineProps<{
    options: Array<PropertyOption>;
    disabled?: boolean;
}>();
defineEmits<{
    change: [obj: PropertyOption];
}>();
const model = defineModel<string>();
const isFocus = ref(false);
const selectedLabel = computed(() => {
    if (model.value)
        return props.options.find(option => option.value === model.value)?.label;
    return undefined;
});
</script>

<template>
    <div class="flex size-full items-center">
        <USelectMenu
            v-model="model"
            :disabled="$props.disabled"
            class="w-full"
            :options="$props.options"
            @open="isFocus = true"
            @close="isFocus = false"
            @update:model-value="(e: PropertyOption) => { model = e.value }"
            @change="(e) => $emit('change', e)"
        >
            <template #default>
                <UButton
                    class="flex-1"
                    size="sm"
                    color="gray"
                    :variant="isFocus ? 'solid' : 'ghost'"
                >
                    <span v-if="selectedLabel">{{ selectedLabel }}</span>
                    <span v-else class="font-normal opacity-50">-</span>
                </UButton>
            </template>
        </USelectMenu>
    </div>
</template>
