<script setup lang="ts">
import ProjectPreview from './app-project-preview.vue';
import type { PreviewActionDto, PreviewDto, ProjectDto, ServerData } from '~/types';

// Dependencies
const app = useAppStore();
const sideMenu = useSideMenuStore();
const projectModal = useProjectModalStore();
const searchModal = useSearchModalStore();
const mouse = useMouse();
const shortcut = useShortcuts();
const api = usePrivateApi();
const socket = useSocketClientStore();

// States
const asideRef = ref<HTMLDivElement>();
const resizeHandlerRef = ref<HTMLDivElement>();
const isResizing = ref(false);

useEventListener(window, 'blur', () => isResizing.value = false);
useEventListener(window, 'mouseup', () => isResizing.value = false);
useEventListener(resizeHandlerRef, 'mousedown', (e) => {
    e.preventDefault();
    isResizing.value = sideMenu.isOpen;
});

watch([isResizing, mouse.x], () => {
    if (isResizing.value && sideMenu.isOpen) {
        asideRef.value!.style.transitionProperty = 'none';
        document.getElementsByTagName('body').item(0)!.style.cursor = 'col-resize';

        const maxWidth = Number.parseInt(getComputedStyle(asideRef.value!).maxWidth);
        const minWidth = Number.parseInt(getComputedStyle(asideRef.value!).minWidth);
        const width = mouse.x.value - asideRef.value!.getBoundingClientRect().left;

        if (width >= maxWidth)
            sideMenu.size = maxWidth;
        else if (minWidth < width && width < maxWidth)
            sideMenu.size = width;
        else
            sideMenu.size = minWidth;
    }
    else {
        if (asideRef.value) {
            asideRef.value.style.transitionProperty = 'all';
            document.getElementsByTagName('body').item(0)!.style.cursor = 'default';
        }
    }
});

const isLoadingProjects = ref(true);
const previews = ref<PreviewDto[]>([]);
const hasProjects = computed(() => previews.value.length > 0);
onMounted(async () => {
    isLoadingProjects.value = true;
    const respose: ServerData<PreviewDto[]> = await api.get('/api/user/projects/preview');
    previews.value = respose.data;
    isLoadingProjects.value = false;

    // TODO: implement project preview sync
    socket.subscribe(`/topic/user/${app.user?.id}/project/previews`, (payload: PreviewActionDto) => {
        if (payload.action === 'ADD_CHILD') {
            previews.value.unshift({
                id: payload.id,
                name: payload.name,
                imageId: payload.imageId,
            });
        }
        else if (payload.action === 'DELETE_CHILD') {
            removePreview(payload.id);
        }
    });
});

function removePreview(previewId: string) {
    const targetIndex = previews.value.findIndex(preview => preview.id === previewId);
    if (targetIndex >= 0)
        previews.value.splice(targetIndex, 1);
}
</script>

<template>
    <aside
        ref="asideRef" class="flex h-full shrink-0 overflow-hidden bg-gray-100 transition-all dark:bg-gray-800"
        :class="[sideMenu.isOpen ? 'min-w-60 max-w-[30rem]' : 'min-w-0 max-w-0']"
        :style="{ width: `${sideMenu.size}px` }"
    >
        <!-- Body -->
        <div class="flex size-full flex-col gap-3 overflow-hidden px-4 py-3">
            <header class="flex w-full items-center gap-2">
                <UAvatar :src="app.userImageUrl" :alt="app.userFullName" size="md" />
                <span class="truncate text-sm font-semibold opacity-70">{{ app.userFullName }}</span>
            </header>

            <section class="w-full">
                <UTooltip
                    text="Jump and open page" class="w-full"
                    :shortcuts="[shortcut.metaSymbol.value, 'Shift', 'S']" :popper="{ placement: 'right' }"
                >
                    <UButton
                        color="gray" label="Search" icon="i-heroicons-magnifying-glass" variant="ghost"
                        class="justify-start text-gray-500 hover:bg-gray-200 dark:text-gray-400" size="sm" block
                        @click="() => searchModal.isOpen = true"
                    />
                </UTooltip>

                <UButton
                    color="gray" label="Home" icon="i-heroicons-home" variant="ghost"
                    class="justify-start text-gray-500 hover:bg-gray-200 dark:text-gray-400" size="sm" block
                    @click="() => navigateTo('/')"
                />

                <UButton
                    color="gray" label="Setting" icon="i-heroicons-cog-6-tooth" variant="ghost"
                    class="justify-start text-gray-500 hover:bg-gray-200 dark:text-gray-400" size="sm" block
                    @click="() => navigateTo('/setting')"
                />

                <UTooltip
                    text="Create new project" class="w-full" :popper="{ placement: 'right' }"
                    :shortcuts="[shortcut.metaSymbol.value, 'Shift', 'P']"
                >
                    <UButton
                        color="gray" label="Add Project" icon="i-heroicons-plus-circle" variant="ghost"
                        class="justify-start text-gray-500 hover:bg-gray-200 dark:text-gray-400" size="sm" block
                        @click="() => projectModal.isOpen = true"
                    />
                </UTooltip>

                <DevOnly>
                    <UButton
                        color="gray" label="Editor" icon="i-heroicons-code-bracket-square" variant="ghost"
                        class="justify-start text-gray-500 hover:bg-gray-200 dark:text-gray-400" size="sm" block
                        @click="() => navigateTo('/public/editor') "
                    />
                </DevOnly>
            </section>

            <section class="flex w-full flex-col">
                <header>
                    <span class="text-sm font-medium opacity-65">Projects</span>
                </header>
                <div class="mt-1 flex w-full flex-col gap-1">
                    <template v-if="isLoadingProjects">
                        <USkeleton class="h-7 w-full" />
                        <USkeleton class="h-7 w-full" />
                        <USkeleton class="h-7 w-full" />
                    </template>
                    <template v-else-if="!isLoadingProjects && hasProjects">
                        <ProjectPreview
                            v-for="project in previews"
                            :key="project.id"
                            :project="project"
                            @deleted="(preview) => removePreview(preview.id)"
                        />
                    </template>
                    <template v-else-if="!isLoadingProjects && !hasProjects">
                        <section class="select-none py-1.5 pl-5 text-xs font-medium text-gray-600 dark:text-gray-400">
                            <span>No Pages</span>
                        </section>
                    </template>
                </div>
            </section>
        </div>

        <!-- Resize Handle -->
        <div
            v-show="sideMenu.isOpen" ref="resizeHandlerRef"
            class="w-1 hover:cursor-col-resize hover:bg-gray-300 dark:hover:bg-gray-600" :class="[
                isResizing
                    ? 'bg-gray-300 dark:bg-gray-600'
                    : 'bg-gray-100 dark:bg-gray-800',
            ]"
        />
    </aside>
</template>
