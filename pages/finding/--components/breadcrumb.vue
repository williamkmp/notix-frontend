<script lang="ts" setup>
import { usePageStore } from '../--stores/page-store';

const pageStore = usePageStore();
</script>

<template>
    <template v-if="true">
        <template v-if="!pageStore.isFetching">
            <UBreadcrumb
                :links="[
                    {
                        label: pageStore.finding.name,
                    },
                ]"
            />
        </template>
        <template v-else>
            <USkeleton class="h-5 w-96 rounded-md" />
        </template>
    </template>
</template>
