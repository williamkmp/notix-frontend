<script setup lang="ts">
import { usePageLoadingStore } from '../../-stores/page-loading';
import SubprojectsTab from './subproject/index.vue';
import MembersTab from './member/index.vue';
import AttachmentsTab from './attachment/index.vue';
import LogsTab from './log/index.vue';

const pageLoadingStore = usePageLoadingStore();
const isLoading = computed(() => pageLoadingStore.isLoading);
</script>

<template>
    <UTabs
        class="flex size-full grow flex-col"
        :ui="{ wrapper: 'space-y-4', container: 'h-full', base: 'size-full' }" :items="[
            { label: 'Projects' },
            { label: 'Members' },
            { label: 'Reports & Attachments' },
            { label: 'Updates' },
        ]"
    >
        <template #item="{ item }">
            <div class="size-full">
                <template v-if="isLoading">
                    <div class="flex size-full items-center justify-center" data-role="loader">
                        <USkeleton class=" flex size-full flex-col items-center justify-center opacity-70" />
                    </div>
                </template>
                <template v-else>
                    <section class="size-full grow">
                        <template v-if="item.label === 'Projects'">
                            <SubprojectsTab />
                        </template>
                        <template v-else-if="item.label === 'Members'">
                            <MembersTab />
                        </template>
                        <template v-else-if="item.label === 'Reports & Attachments'">
                            <AttachmentsTab />
                        </template>
                        <template v-else-if="item.label === 'Updates'">
                            <LogsTab />
                        </template>
                    </section>
                </template>
            </div>
        </template>
    </UTabs>
</template>
