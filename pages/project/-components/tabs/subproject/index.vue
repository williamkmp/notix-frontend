<script lang="ts" setup>
import { useAuthorityStore } from '../../../-stores/authority';
import { useProjectSubprojectStore } from '../../../-stores/subproject';
import SubprojectRow from './components/SubprojectRow.vue';
import { useSubprojectModalStore } from '~/pages/project/-stores/subproject-modal';
import { useProjectStore } from '~/pages/project/-stores/project';

const authority = useAuthorityStore();
const projectStore = useProjectStore();
const subprojectStore = useProjectSubprojectStore();
const subprojectModalStore = useSubprojectModalStore();

const canOperateSubproject = computed(() => authority.userCanOpearteSubProject);
const isProjectActive = computed(() => projectStore.isActive);

const headerClassName = 'text-left opacity-50 first:pl-4 last:pr-4';

function openCreateModal() {
    subprojectModalStore.isOpen = true;
}
</script>

<template>
    <div data-role="project-tab-container" class="size-full flex flex-col gap-1 ">
        <header class="flex w-full items-center justify-between">
            <h1 class="text-2xl font-semibold">
                Projects
            </h1>
            <template v-if="canOperateSubproject">
                <UButton
                    icon="i-heroicons-plus" label="Add" size="md" color="white" variant="solid"
                    :disabled="!isProjectActive" @click="openCreateModal"
                />
            </template>
        </header>

        <section class="size-full">
            <template v-if="!subprojectStore.isEmpty">
                <table class="table w-full max-h-full table-auto border-separate border-spacing-y-4">
                    <thead>
                        <th :class="headerClassName">
                            Project
                        </th>
                        <th :class="headerClassName">
                            Status
                        </th>
                        <th :class="headerClassName">
                            Period
                        </th>
                        <template v-if="canOperateSubproject">
                            <th :class="headerClassName">
                                Action
                            </th>
                        </template>
                    </thead>
                    <tbody>
                        <template v-for="subproject in subprojectStore.list" :key="subproject.id">
                            <SubprojectRow :subproject="subproject" :actionable="canOperateSubproject" />
                        </template>
                    </tbody>
                </table>
            </template>
            <template v-else>
                <div class="flex bg-red-200 size-full items-center justify-center">
                    <section class="flex flex-col items-center justify-center opacity-70">
                        <UIcon name="i-heroicons-no-symbol" class="text-6xl" />
                        <span class="text-base font-semibold">Empty</span>
                        <span class="text-base">No Project, create one to get strated</span>
                    </section>
                </div>
            </template>
        </section>
    </div>
</template>
