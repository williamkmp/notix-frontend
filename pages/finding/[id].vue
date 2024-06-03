<script lang="ts" setup>
import { usePageStore } from './--stores/page-store';

// Components import
import Breadcrumb from './--components/breadcrumb.vue';
import SidepanelContainer from './--components/sidepanel-container.vue';
import MainpanelContainer from './--components/mainpanel-container.vue';
import FindingProfile from './--components/sidepanel-parts/finding-profile.vue';
import FindingProperty from './--components/sidepanel-parts/finding-property.vue';
import FindingCvss from './--components/sidepanel-parts/finding-cvss.vue';
import FindingConsultantList from './--components/sidepanel-parts/finding-consultant-list.vue';
import AppPage from '~/layouts/-components/app-page.vue';

const pageStore = usePageStore();
const route = useRoute();

useLazyAsyncData(
    `finding-page-data`,
    async () => {
        const findingId = route.params.id as string;
        await pageStore.initializeData(findingId);
    },
    { watch: [route.params] },
);
</script>

<template>
    <AppPage>
        <template #left-header>
            <Breadcrumb />
        </template>

        <template #body>
            <div class="flex size-full gap-6">
                <SidepanelContainer>
                    <FindingProfile />
                    <UDivider class="mt-1" />
                    <FindingProperty />
                    <FindingCvss />
                    <FindingConsultantList />
                </SidepanelContainer>

                <MainpanelContainer>
                    <template #header>
                        <UTabs
                            :items="[
                                { label: 'Document' },
                                { label: 'CVSS' },
                                { label: 'Test Results' },
                                { label: 'Discussions' },
                            ]" :default-index="0"
                        />
                    </template>
                </MainpanelContainer>
            </div>
        </template>
    </AppPage>
</template>
