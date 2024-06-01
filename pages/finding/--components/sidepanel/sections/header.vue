<script lang="ts" setup>
import { usePageStore } from '../../../--stores/page-store';

const pageStore = usePageStore();
const riskScore = computed(() => pageStore.findingRiskScore);
const riskLevel = computed(() => pageStore.findingRiskLevel);

const badgeStyle = {
    'bg-slate-50 dark:bg-slate-400 text-slate-500 dark:text-slate-400 ring-slate-500 dark:ring-slate-400': riskLevel.value === 'LOW',
    'bg-orange-50 dark:bg-orange-400 text-orange-500 dark:text-orange-400 ring-orange-500 dark:ring-orange-400': riskLevel.value === 'MEDIUM',
    'bg-red-50 dark:bg-red-400 text-red-500 dark:text-red-400 ring-red-500 dark:ring-red-400': riskLevel.value === 'HIGH',
    'bg-rose-50 dark:bg-rose-400 text-rose-500 dark:text-rose-400 ring-rose-500 dark:ring-rose-400': riskLevel.value === 'EXTREME',
};
</script>

<template>
    <div class="flex w-full p-2">
        <template v-if="!pageStore.isFetching">
            <!-- Finding risk score -->
            <section>
                <!-- eslint-disable tailwindcss/migration-from-tailwind-2 -->
                <div
                    class="flex size-14 items-center justify-center rounded-md ring-1 ring-inset ring-opacity-25 dark:bg-opacity-10 dark:ring-opacity-25"
                    :class="badgeStyle"
                >
                    <span class="text-4xl font-bold">
                        {{ riskScore }}
                    </span>
                </div>
            </section>
        </template>
        <template v-else>
            <USkeleton class="size-14 rounded-md" />
        </template>
    </div>
</template>
