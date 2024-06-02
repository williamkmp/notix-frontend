<script lang="ts" setup>
import { usePageStore } from '../../--stores/page-store';
import type { UI_COLOR } from '~/types';

const pageStore = usePageStore();
const clipBoard = useClipboard();
const notif = useNotification();

function doCopy() {
    clipBoard.copy(pageStore.cvssString);
    notif.ok({
        title: 'Copied',
        message: 'CVSS String copied',
    });
}

const badgeColor = computed((): UI_COLOR => {
    if (pageStore.cvssRating === 'LOW')
        return 'green';
    else if (pageStore.cvssRating === 'MEDIUM')
        return 'orage';
    else if (pageStore.cvssRating === 'HIGH')
        return 'red';
    else if (pageStore.cvssRating === 'CRITICAL')
        return 'red';
    return 'gray';
});
</script>

<template>
    <section data-role="finding-cvss-detail" class="mt-1 flex w-full flex-col">
        <header class="flex w-full items-center gap-2">
            <span class="text-sm font-bold">CVSS</span>
            <template v-if="pageStore.isDataLoaded">
                <UBadge size="xs" variant="subtle" :color="badgeColor" :label="`${pageStore.cvssScore} ${pageStore.cvssRating}`" />
            </template>
        </header>

        <div class="mt-2 flex w-full flex-col gap-2">
            <!-- CVSS String display -->
            <template v-if="pageStore.isDataLoaded">
                <div class="group relative w-full rounded-md">
                    <UTextarea
                        :model-value="pageStore.cvssString" color="gray" variant="outline"
                        :ui="{ size: { xs: 'text-sm' } }" size="xs" autoresize :rows="2" disabled
                    />
                    <div
                        class="absolute top-0 flex size-full items-center justify-center rounded-md bg-black/10 opacity-0 group-hover:opacity-100"
                    >
                        <UButton
                            label="copy" size="2xs" color="white" icon="i-heroicons-document-duplicate"
                            @click="doCopy"
                        />
                    </div>
                </div>
            </template>
            <template v-else>
                <USkeleton class="h-[3.25rem] w-full rounded-md" />
            </template>
        </div>
    </section>
</template>
