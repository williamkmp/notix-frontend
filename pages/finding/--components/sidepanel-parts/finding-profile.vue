<script lang="ts" setup>
import { usePageStore } from '../../--stores/page-store';

const pageStore = usePageStore();
const isLoaded = computed(() => pageStore.isDataLoaded);

const canEditTitle = ref(true);
const titleInputFocused = ref(false);

const badgeStyle = computed(() => {
    if (pageStore.findingRiskLevel === 'MEDIUM')

        return 'bg-orange-50 dark:bg-orange-400/10 text-orange-500 dark:text-orange-400 ring-orange-500/25 dark:ring-orange-400/25';
    else if (pageStore.findingRiskLevel === 'HIGH')

        return 'bg-red-50 dark:bg-red-400/10 text-red-500 dark:text-red-400 ring-red-500/25 dark:ring-red-400/25';
    else if (pageStore.findingRiskLevel === 'EXTREME')

        return 'bg-rose-50 dark:bg-rose-400/10 text-rose-500 dark:text-rose-400 ring-rose-500/25 dark:ring-rose-400/25';
    return 'bg - slate - 50 dark: bg - slate - 400 / 10 text - slate - 500 dark: text - slate - 400 ring - slate - 500 / 25 dark: ring - slate - 400 / 25';
});
</script>

<template>
    <section data-role="finding-information-header" class="flex w-full flex-col gap-1">
        <!-- Finding Created Date -->
        <header class="flex w-full justify-end">
            <template v-if="isLoaded">
                <span class="text-xs">{{ pageStore.findingCreatedDate }}</span>
            </template>
            <template v-else>
                <USkeleton class="h-4 w-20 rounded-md" />
            </template>
        </header>

        <!-- Main content -->
        <div class="flex w-full items-start gap-4">
            <!-- Risk Score & Level badge -->
            <div class="flex flex-col gap-1">
                <!-- Risk Score -->
                <template v-if="isLoaded">
                    <div
                        class="flex size-14 shrink-0 items-center justify-center rounded-md ring-2 ring-inset"
                        :class="badgeStyle"
                    >
                        <span class="text-2xl font-bold">
                            {{ pageStore.findingRiskScore }}
                        </span>
                    </div>
                </template>
                <template v-else>
                    <USkeleton class="size-14 shrink-0 rounded-md" />
                </template>
            </div>

            <!-- Finding Name & Creator Display -->
            <div class="flex w-full flex-col justify-end gap-1">
                <!-- Finding Name Input -->
                <template v-if="isLoaded">
                    <UInput
                        v-model="pageStore.finding!.name" placeholder="Untitled" :disabled="!canEditTitle" size="xl"
                        :variant="titleInputFocused ? 'outline' : 'none'"
                        class="h-min w-full grow-0 py-0 font-bold transition" :class="{
                            'hover:bg-gray-200 dark:hover:bg-gray-600': canEditTitle,
                        }" :ui="{
                            size: { xl: 'text-lg' },
                            padding: { xl: 'p-0' },
                            base: 'disabled:cursor-not-allowed disabled:opacity-100 ',
                        }" @focus="titleInputFocused = true" @blur="titleInputFocused = false"
                    />
                </template>
                <template v-else>
                    <USkeleton class="h-7 w-full rounded-md" />
                </template>

                <!-- Finding Creator -->
                <template v-if="isLoaded">
                    <div class="flex w-full items-center gap-1">
                        <UAvatar :src="pageStore.creatorImageUrl" :alt="pageStore.creator!.fullName" size="2xs" />
                        <span class="text-xs font-normal">
                            {{ pageStore.creator!.fullName }}
                        </span>
                    </div>
                </template>
                <template v-else>
                    <USkeleton class="h-5 w-full rounded-md" />
                </template>
            </div>
        </div>
    </section>
</template>
