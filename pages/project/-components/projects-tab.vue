<script lang="ts" setup>
import { useAuthorityStore } from '../-stores/authority';
import { useProjectSubprojectStore } from '../-stores/subproject';
import type { SubprojectDto } from '~/types';

const authority = useAuthorityStore();
const subprojectStore = useProjectSubprojectStore();
const dayjs = useDayjs();

function getSubprojectStatus(start: Date, end: Date) {
    const today = dayjs();
    const startDay = dayjs(start).startOf('day');
    const endDay = dayjs(end).endOf('day');

    if (today.isBefore(startDay))
        return 'NOT_STARTED';
    else if (today.isAfter(endDay))
        return 'FINISHED';
    return 'ON_GOING';
}

function formatPeriod(start: Date, end: Date) {
    const startDay = dayjs(start).startOf('day').format('DD MMM, YYYY');
    const endDay = dayjs(end).endOf('day').format('DD MMM, YYYY');
    return `${startDay} → ${endDay}`;
}

const className = {
    header: 'text-left opacity-50 first:pl-4 last:pr-4',
    body: 'py-3 text-left first:pl-4 last:pr-4 first:rounded-l-lg last:rounded-r-lg first:border-l last:border-r border-y border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900',
};
</script>

<template>
    <div data-role="project-tab-container" class="group flex w-full flex-col gap-1">
        <header class="flex w-full items-center justify-between">
            <h1 class="text-2xl font-semibold">
                Projects
            </h1>
            <UButton
                v-if="authority.userCanOpearteSubProject" icon="i-heroicons-plus" label="Add" size="md"
                color="white" variant="solid"
            />
        </header>

        <section>
            <table class="table w-full table-auto border-separate border-spacing-y-4">
                <thead>
                    <th :class="className.header">
                        Project
                    </th>
                    <th :class="className.header">
                        Status
                    </th>
                    <th :class="className.header">
                        Period
                    </th>
                    <th v-if="authority.userCanOpearteSubProject" :class="className.header">
                        Action
                    </th>
                </thead>
                <tbody>
                    <template v-for="subproject in subprojectStore.list" :key="subproject.id">
                        <tr>
                            <td :class="className.body">
                                <div class="flex items-center gap-4">
                                    <UAvatar :alt="subproject.name.toUpperCase()" size="md" />
                                    <span class="font-semibold">{{ subproject.name }}</span>
                                </div>
                            </td>
                            <td :class="className.body">
                                <template
                                    v-if="getSubprojectStatus(subproject.startDate, subproject.endDate) === 'NOT_STARTED'"
                                >
                                    <UBadge label="Not Started" variant="subtle" color="slate" />
                                </template>
                                <template
                                    v-else-if="getSubprojectStatus(subproject.startDate, subproject.endDate) === 'ON_GOING'"
                                >
                                    <UBadge label="On Going" variant="subtle" color="blue" />
                                </template>
                                <template
                                    v-else-if="getSubprojectStatus(subproject.startDate, subproject.endDate) === 'FINISHED'"
                                >
                                    <UBadge label="Finished" variant="subtle" color="green" />
                                </template>
                            </td>
                            <td :class="className.body">
                                <span class="opacity-60">
                                    {{ formatPeriod(subproject.startDate, subproject.endDate) }}
                                </span>
                            </td>
                            <template v-if="authority.userCanOpearteSubProject">
                                <td :class="className.body">
                                    <div class="flex items-center justify-start gap-2">
                                        <UButton icon="i-heroicons-trash" variant="outline" color="red" />
                                    </div>
                                </td>
                            </template>
                        </tr>
                    </template>
                </tbody>
            </table>
        </section>
    </div>
</template>
