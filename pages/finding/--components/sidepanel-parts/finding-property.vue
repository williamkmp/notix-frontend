<script lang="ts" setup>
import { usePageStore } from '../../--stores/page-store';
import PropertLabel from './--components/property-label.vue';
import PropertRow from './--components/property-row.vue';
import PropertSelect from './--components/property-select.vue';
import PropertText from './--components/property-text.vue';
import type { FINDING_CATEGORY, FINDING_IMPACT, FINDING_LIKELIHOOD, FINDING_LOCATION, FINDING_METHOD, PropertyOption } from '~/types/index';

const pageStore = usePageStore();

const categoryOptions: PropertyOption<FINDING_CATEGORY>[] = [
    {
        value: 'INFRASTRUCTURE',
        label: 'Infrastructure',
    },
    {
        value: 'API',
        label: 'API',
    },
    {
        value: 'IOS',
        label: 'IOS',
    },
    {
        value: 'ANDROID',
        label: 'Android',
    },
    {
        value: 'WEB',
        label: 'Website',
    },
];

const locationOptions: PropertyOption<FINDING_LOCATION>[] = [
    {
        value: 'INTERNAL',
        label: 'Internal',
    },
    {
        value: 'EXTERNAL',
        label: 'External',
    },
];

const methodOptions: PropertyOption<FINDING_METHOD>[] = [
    {
        value: 'WHITE_BOX',
        label: 'White box',
    },
    {
        value: 'BLACK_BOX',
        label: 'Black box',
    },
    {
        value: 'GREY_BOX',
        label: 'Gray box',
    },
];

const impactOptions: PropertyOption<FINDING_IMPACT>[] = [
    {
        value: 'INSIGNIFICANT',
        label: 'Insignificant',
    },
    {
        value: 'MINOR',
        label: 'Minor',
    },
    {
        value: 'MODERATE',
        label: 'Moderate',
    },
    {
        value: 'MAJOR',
        label: 'Major',
    },
    {
        value: 'CATASTROPHIC',
        label: 'Catastrophic',
    },
];

const likelihoodOptions: PropertyOption<FINDING_LIKELIHOOD>[] = [
    {
        value: 'RARE',
        label: 'Rare',
    },
    {
        value: 'UNLIKELY',
        label: 'Unlikely',
    },
    {
        value: 'POSSIBLE',
        label: 'Possible',
    },
    {
        value: 'LIKELY',
        label: 'Likely',
    },
    {
        value: 'CERTAINLY',
        label: 'Certainly',
    },
];
</script>

<template>
    <section data-role="finding-property" class="-mt-1 flex w-full flex-col">
        <header class="py-0">
            <span class="text-sm font-bold">Properties</span>
        </header>

        <div class="mt-1 grid w-full grid-cols-2 gap-1">
            <PropertRow>
                <template #left>
                    <PropertLabel
                        label="Category"
                        icon="i-material-symbols-category-rounded"
                        :loading="pageStore.isDataLoading"
                    />
                </template>
                <template #right>
                    <template v-if="pageStore.finding && pageStore.isDataLoaded">
                        <PropertSelect
                            v-model="pageStore.finding.findingDetail.caregory"
                            :options="categoryOptions"
                            @change="selectedOption => pageStore.postUpdateFindingCategory(selectedOption.value as FINDING_CATEGORY)"
                        />
                    </template>
                    <template v-else>
                        <USkeleton class="my-0.5 h-7 w-full rounded-md" />
                    </template>
                </template>
            </PropertRow>

            <PropertRow>
                <template #left>
                    <PropertLabel
                        label="Location"
                        icon="i-material-symbols-location-searching-rounded"
                        :loading="pageStore.isDataLoading"
                    />
                </template>
                <template #right>
                    <template v-if="pageStore.finding && pageStore.isDataLoaded">
                        <PropertSelect
                            v-model="pageStore.finding.findingDetail.location"
                            :options="locationOptions"
                            @change="selectedOption => pageStore.postUpdateFindingLocation(selectedOption.value as FINDING_LOCATION)"
                        />
                    </template>
                    <template v-else>
                        <USkeleton class="my-0.5 h-7 w-full rounded-md" />
                    </template>
                </template>
            </PropertRow>

            <PropertRow>
                <template #left>
                    <PropertLabel
                        label="Method"
                        icon="i-material-symbols-search-rounded"
                        :loading="pageStore.isDataLoading"
                    />
                </template>
                <template #right>
                    <template v-if="pageStore.finding && pageStore.isDataLoaded">
                        <PropertSelect
                            v-model="pageStore.finding.findingDetail.method"
                            :options="methodOptions"
                            @change="selectedOption => pageStore.postUpdateFindingMethod(selectedOption.value as FINDING_METHOD)"
                        />
                    </template>
                    <template v-else>
                        <USkeleton class="my-0.5 h-7 w-full rounded-md" />
                    </template>
                </template>
            </PropertRow>

            <PropertRow>
                <template #left>
                    <PropertLabel
                        label="Application Name"
                        icon="i-heroicons-bars-3-bottom-left"
                        :loading="pageStore.isDataLoading"
                    />
                </template>
                <template #right>
                    <template v-if="pageStore.finding && pageStore.isDataLoaded">
                        <PropertText
                            v-model="pageStore.finding.findingDetail.applicationName"
                            @change="(newValue) => pageStore.postUpdateFindingApplicationName(newValue)"
                        />
                    </template>
                    <template v-else>
                        <USkeleton class="my-0.5 h-7 w-full rounded-md" />
                    </template>
                </template>
            </PropertRow>

            <PropertRow>
                <template #left>
                    <PropertLabel
                        label="Environment"
                        icon="i-material-symbols-nest-eco-leaf-outline-rounded"
                        :loading="pageStore.isDataLoading"
                    />
                </template>
                <template #right>
                    <template v-if="pageStore.finding && pageStore.isDataLoaded">
                        <PropertText
                            v-model="pageStore.finding.findingDetail.environment"
                            @change="(newValue) => pageStore.postUpdateFindingEnvironment(newValue)"
                        />
                    </template>
                    <template v-else>
                        <USkeleton class="my-0.5 h-7 w-full rounded-md" />
                    </template>
                </template>
            </PropertRow>

            <PropertRow>
                <template #left>
                    <PropertLabel
                        label="Impact"
                        icon="i-material-symbols-bomb-outline-rounded"
                        :loading="pageStore.isDataLoading"
                    />
                </template>
                <template #right>
                    <template v-if="pageStore.finding && pageStore.isDataLoaded">
                        <PropertSelect
                            v-model="pageStore.finding.findingDetail.impact"
                            :options="impactOptions"
                            @change="selectedOption => pageStore.postUpdateFindingImpact(selectedOption.value as FINDING_IMPACT) "
                        />
                    </template>
                    <template v-else>
                        <USkeleton class="my-0.5 h-7 w-full rounded-md" />
                    </template>
                </template>
            </PropertRow>

            <PropertRow>
                <template #left>
                    <PropertLabel
                        label="Likelihood"
                        icon="i-material-symbols-speed-outline-rounded"
                        :loading="pageStore.isDataLoading"
                    />
                </template>
                <template #right>
                    <template v-if="pageStore.finding && pageStore.isDataLoaded">
                        <PropertSelect
                            v-model="pageStore.finding.findingDetail.likelihood"
                            :options="likelihoodOptions"
                            @change="selectedOption => pageStore.postUpdateFindingLikelihood(selectedOption.value as FINDING_LIKELIHOOD) "
                        />
                    </template>
                    <template v-else>
                        <USkeleton class="my-0.5 h-7 w-full rounded-md" />
                    </template>
                </template>
            </PropertRow>
        </div>
    </section>
</template>
