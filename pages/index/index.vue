<script setup lang="ts">
import AppPage from '~/layouts/-components/app-page.vue';

const sideMenu = useSideMenuStore();
</script>

<template>
    <AppPage>
        <template #body>
            <div class="flex size-full flex-col items-center justify-center gap-4 p-8">
                <h1>Home page</h1>
                <UButton label="Toggle" @click="sideMenu.toggleOpen" />
            </div>
        </template>
    </AppPage>
</template>
