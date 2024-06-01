<script lang="ts" setup>
import { usePageStore } from './--stores/page-store';

// Components import
import Breadcrumb from './--components/breadcrumb.vue';
import SidepanelContainer from './--components/sidepanel/container.vue';
import SidepanelHeader from './--components/sidepanel/sections/header.vue';
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
            <div class="flex size-full">
                <SidepanelContainer>
                    <SidepanelHeader />
                    <UDivider class="my-2" />
                </SidepanelContainer>

                <section
                    data-role="finding-mainpanel"
                    class="size-full"
                >
                    <!--  -->
                </section>
            </div>
        </template>
    </AppPage>
</template>
