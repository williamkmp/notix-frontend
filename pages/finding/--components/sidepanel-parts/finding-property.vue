<script lang="ts" setup>
import { usePageStore } from '../../--stores/page-store';
import PropertLabel from './--components/property-label.vue';
import PropertRow from './--components/property-row.vue';
import PropertSelect from './--components/property-select.vue';
import PropertText from './--components/property-text.vue';

const pageStore = usePageStore();
</script>

<template>
    <section data-role="finding-property" class="-mt-1 flex w-full flex-col">
        <header class="py-0">
            <span class="text-sm font-bold">Properties</span>
        </header>

        <div class="mt-1 grid w-full grid-cols-2 gap-x-2">
            <PropertRow>
                <template #left>
                    <PropertLabel
                        :loading="pageStore.isDataLoading" label="Category"
                        icon="i-material-symbols-category-rounded"
                    />
                </template>
                <template #right>
                    <PropertSelect :loading="pageStore.isDataLoading" :options="[]" />
                </template>
            </PropertRow>

            <PropertRow>
                <template #left>
                    <PropertLabel
                        :loading="pageStore.isDataLoading" label="Location"
                        icon="i-material-symbols-location-searching-rounded"
                    />
                </template>
                <template #right>
                    <PropertSelect :loading="pageStore.isDataLoading" :options="[]" />
                </template>
            </PropertRow>

            <PropertRow>
                <template #left>
                    <PropertLabel
                        :loading="pageStore.isDataLoading" label="Method"
                        icon="i-material-symbols-search-rounded"
                    />
                </template>
                <template #right>
                    <PropertSelect :loading="pageStore.isDataLoading" :options="[]" />
                </template>
            </PropertRow>

            <PropertRow>
                <template #left>
                    <PropertLabel :loading="pageStore.isDataLoading" label="Application Name" />
                </template>
                <template #right>
                    <PropertText />
                </template>
            </PropertRow>

            <PropertRow>
                <template #left>
                    <PropertLabel
                        :loading="pageStore.isDataLoading" label="Environment"
                        icon="i-material-symbols-nest-eco-leaf-outline-rounded"
                    />
                </template>
                <template #right>
                    <PropertText :loading="pageStore.isDataLoading" />
                </template>
            </PropertRow>

            <PropertRow>
                <template #left>
                    <PropertLabel
                        :loading="pageStore.isDataLoading" label="Impact"
                        icon="i-material-symbols-bomb-outline-rounded"
                    />
                </template>
                <template #right>
                    <PropertSelect :loading="pageStore.isDataLoading" :options="[]" />
                </template>
            </PropertRow>

            <PropertRow>
                <template #left>
                    <PropertLabel
                        :loading="pageStore.isDataLoading" label="Likelihood"
                        icon="i-material-symbols-speed-outline-rounded"
                    />
                </template>
                <template #right>
                    <PropertSelect :loading="pageStore.isDataLoading" :options="[]" />
                </template>
            </PropertRow>
        </div>
    </section>
</template>
