<script setup lang="ts">
import type { SubprojectData } from '~/types';

const props = defineProps<{
    actionable: boolean;
    subproject: SubprojectData;
}>();
defineEmits<{
    delete: [subproject: SubprojectData];
}>();
const dayjs = useDayjs();

const sanitizedSubprojectName = computed(() => props.subproject.name
    .replace(/[^a-zA-Z0-9]/ig, ' ')
    .replace(/([\s\S])\1+/g, ' ')
    .toUpperCase(),
);

const progressStatus = computed(() => {
    const today = dayjs();
    const startDay = props.subproject.startDate.startOf('day');
    const endDay = props.subproject.endDate.endOf('day');

    if (today.isBefore(startDay))
        return 'NOT_STARTED';
    else if (today.isAfter(endDay))
        return 'FINISHED';
    return 'ON_GOING';
});

const activePeriode = computed(() => {
    const displayFormat = 'DD MMM YYYY';
    const startDay = props.subproject.startDate.startOf('day').format(displayFormat);
    const endDay = props.subproject.endDate.endOf('day').format(displayFormat);
    return `${startDay} → ${endDay}`;
});

const className = 'py-3 text-left first:pl-4 last:pr-4 first:rounded-l-lg last:rounded-r-lg first:border-l last:border-r border-y border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900';
</script>

<template>
    <tr>
        <td :class="className">
            <div class="flex items-center gap-4">
                <UAvatar :alt="sanitizedSubprojectName" size="md" />
                <span class="font-semibold">{{ subproject.name }}</span>
            </div>
        </td>
        <td :class="className">
            <template v-if="progressStatus === 'NOT_STARTED'">
                <UBadge label="Not Started" variant="subtle" color="slate" />
            </template>
            <template v-else-if="progressStatus === 'ON_GOING'">
                <UBadge label="On Going" variant="subtle" color="blue" />
            </template>
            <template v-else-if="progressStatus === 'FINISHED'">
                <UBadge label="Finished" variant="subtle" color="green" />
            </template>
        </td>
        <td :class="className">
            <span class="opacity-60">
                {{ activePeriode }}
            </span>
        </td>
        <template v-if="props.actionable">
            <td :class="className">
                <div class="flex items-center justify-start gap-2">
                    <UButton
                        icon="i-heroicons-trash" variant="outline" color="red"
                        @click="$emit('delete', props.subproject)"
                    />
                </div>
            </td>
        </template>
    </tr>
</template>
