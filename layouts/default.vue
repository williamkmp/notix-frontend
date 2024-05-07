<script setup lang="ts">
import AppAside from './-components/app-aside.vue';
import ProjectModal from './-components/app-project-modal.vue';
import SearchModal from './-components/app-search-modal.vue';

const projectModal = useProjectModalStore();
const searchModal = useSearchModalStore();
const sideMenu = useSideMenuStore();

defineShortcuts({
    'meta_\\': {
        usingInput: true,
        handler: () => sideMenu.toggleOpen(),
    },
    'meta_shift_p': {
        usingInput: true,
        handler: () => projectModal.isOpen = true,
    },
    'meta_shift_s': {
        usingInput: true,
        handler: () => searchModal.isOpen = true,
    },
});
</script>

<template>
    <div class="flex h-screen w-screen overflow-y-auto">
        <AppAside />
        <div class="max-h-screen grow overflow-y-auto">
            <slot />
        </div>
        <UNotifications />
        <ProjectModal />
        <SearchModal />
    </div>
</template>
