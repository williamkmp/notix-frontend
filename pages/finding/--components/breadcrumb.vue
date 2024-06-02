<script lang="ts" setup>
import { usePageStore } from '../--stores/page-store';

const pageStore = usePageStore();
</script>

<template>
    <template v-if="true">
        <template v-if="pageStore.isDataLoaded">
            <UBreadcrumb
                :links="[
                    { label: 'Project' },
                    { label: 'Subproject' },
                    { label: pageStore.finding!.name },
                ]" divider="i-heroicons-chevron-right-20-solid"
            />
        </template>
        <template v-else>
            <USkeleton class="h-5 w-96 rounded-md" />
        </template>
    </template>
</template>
