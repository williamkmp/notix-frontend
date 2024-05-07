<script lang="ts" setup>
import type { Dayjs } from 'dayjs';
import { v4 as uuid } from 'uuid';
import DateDisplay from './date-display.vue';
import type { DateDisplayMode, EventDto } from '~/types';

const dayjs = useDayjs();
const currentDate = ref(dayjs().startOf('day'));
const todayDate = ref(dayjs().startOf('day'));

// Placeholder data
const events: EventDto[] = [
    {
        id: uuid(),
        name: 'Login',
        startDate: dayjs().startOf('day').subtract(7, 'day').toISOString(),
        endDate: dayjs().startOf('day').add(1, 'day').toISOString(),
    },
    {
        id: uuid(),
        name: 'Web Security',
        startDate: dayjs().startOf('day').subtract(3, 'day').toISOString(),
        endDate: dayjs().startOf('day').subtract(1, 'day').toISOString(),
    },

];

const headers = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const displayDate = computed(() => {
    const weeks = Array(6).fill(null).map((value, index) => index);
    const days = Array(7).fill(null).map((value, index) => index);
    const displayDate: Dayjs[] = [];
    let current = currentDate.value.startOf('month').startOf('week');
    for (const _week in weeks) {
        for (const _day of days) {
            displayDate.push(current);
            current = current.add(1, 'day');
        }
    }
    return displayDate;
});

function toNextDisplay() {
    currentDate.value = currentDate.value.add(1, 'month');
}

function toPrevDisplay() {
    currentDate.value = currentDate.value.subtract(1, 'month');
}

function toTodayDisplay() {
    currentDate.value = dayjs().startOf('day');
    todayDate.value = dayjs().startOf('day');
}

function getRenderMode(date: Dayjs): DateDisplayMode {
    const monthStartDate = currentDate.value.startOf('month');
    const monthEndDate = currentDate.value.endOf('month');

    return date.isBefore(monthStartDate, 'day') || date.isAfter(monthEndDate, 'day')
        ? 'DISABLED'
        : 'ACTIVE';
}

function isToday(date: Dayjs) {
    return todayDate.value.isSame(date);
}
</script>

<template>
    <section>
        <header class="flex items-center justify-between p-2">
            <span class="text-lg font-semibold">
                {{ currentDate.format("MMMM YYYY") }}
            </span>

            <div class="flex gap-1">
                <UButton icon="i-heroicons-chevron-left" variant="ghost" color="gray" @click="toPrevDisplay" />
                <UButton label="Today" color="gray" variant="ghost" @click="toTodayDisplay" />
                <UButton icon="i-heroicons-chevron-right" variant="ghost" color="gray" @click="toNextDisplay" />
            </div>
        </header>

        <UDivider />

        <div class="mt-4 w-full">
            <header class="grid grid-cols-7 grid-rows-1 py-4">
                <div v-for="day in headers" :key="day" class="flex h-4 justify-center">
                    <span class="text-center text-sm font-semibold text-gray-700">
                        {{ day }}
                    </span>
                </div>
            </header>

            <div class="grid grid-cols-7 grid-rows-5 border border-gray-200">
                <template v-for="date in displayDate" :key="date.format('ddmmyyy')">
                    <DateDisplay
                        :date="date"
                        :is-today="isToday(date)"
                        :mode="getRenderMode(date)"
                        :event="events"
                    />
                </template>
            </div>
        </div>
    </section>
</template>
