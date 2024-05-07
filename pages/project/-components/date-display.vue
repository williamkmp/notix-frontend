<script setup lang="ts">
import type { DateDisplayBoxProps, EventDto } from '~/types';

const props = defineProps<DateDisplayBoxProps>();
const dayjs = useDayjs();

function isBegining(event: EventDto) {
    const eventStartDate = dayjs(event.startDate);
    return props.date.isSame(eventStartDate);
}

function isEndDate(event: EventDto) {
    const eventEndDate = dayjs(event.endDate);
    return props.date.isSame(eventEndDate);
}

function inEventDuration(event: EventDto) {
    const eventStartDate = dayjs(event.startDate);
    const eventEndDate = dayjs(event.endDate);
    return props.date.isBetween(
        eventStartDate,
        eventEndDate,
        null,
        '[]',
    );
}

function isShowEventName(event: EventDto) {
    const isWeekStartDate = props.date.startOf('week').isSame(props.date);
    const isEventBegining = isBegining(event);
    return isWeekStartDate || isEventBegining;
}
</script>

<template>
    <div
        class="flex min-h-40 select-none flex-col gap-2 border border-gray-200 py-2"
        :class="props.mode === 'DISABLED'
            ? 'bg-gray-100'
            : props.mode === 'ACTIVE'
                ? 'bg-transparent'
                : 'bg-red-50'
        "
    >
        <header class="flex justify-end px-2">
            <span
                class="rounded p-1"
                :class="[props.isToday ? 'bg-red-500 text-white' : '']"
            >
                {{ props.date.format("DD") }}
            </span>
        </header>

        <template v-if="props.mode !== 'DISABLED'">
            <template v-for="event in props.event" :key="event.id">
                <div
                    class="relative w-full text-white"
                    :class="{
                        'pl-4': isBegining(event),
                        'pr-4': isEndDate(event),
                    }"
                >
                    <div
                        class="truncate px-2 py-1"
                        :style="{ width: 'calc(100% + 2px)' }"
                        :class="{
                            'bg-blue-500': inEventDuration(event),
                            'rounded-l-md': isBegining(event),
                            'rounded-r-md': isEndDate(event),
                        }"
                    >
                        <span class="text-sm">{{ isShowEventName(event) ? event.name : '&nbsp;' }}</span>
                    </div>
                </div>
            </template>
        </template>
    </div>
</template>
