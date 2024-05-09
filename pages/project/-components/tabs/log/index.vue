<script lang="ts" setup>
import { useProjectLogStore } from '../../../-stores/log';

const log = useProjectLogStore();
</script>

<template>
    <div data-role="project-tab-container" class="group flex w-full flex-col gap-4">
        <header class="flex w-full items-center justify-between">
            <h1 class="text-2xl font-semibold">
                Updates
            </h1>
        </header>

        <section class="flex w-full flex-col gap-4">
            <template v-for="record in log.list" :key="record.id">
                <UUpdateLog :log="record" />
            </template>
        </section>
    </div>
</template>
