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
        class="mt-2" :items="[
            { label: 'Projects' },
            { label: 'Members' },
            { label: 'Reports & Attachments' },
            { label: 'Updates' },
        ]"
    >
        <template #item="{ item }">
            <template v-if="isLoading">
                <div class="flex size-full h-80 items-center justify-center" data-role="loader">
                    <USkeleton class=" size-full mt-20 flex flex-col items-center justify-center opacity-70" />
                </div>
            </template>
            <template v-else>
                <section class="mt-4 w-full">
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
        </template>
    </UTabs>
</template>
