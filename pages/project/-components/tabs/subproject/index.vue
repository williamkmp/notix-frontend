<script lang="ts" setup>
import type { Dayjs } from 'dayjs';
import { useAuthorityStore } from '../../../-stores/authority';
import { useProjectSubprojectStore } from '../../../-stores/subproject';
import SubprojectRow from './components/SubprojectRow.vue';
import type { SubprojectDto } from '~/types';
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
    <div data-role="project-tab-container" class="group flex w-full flex-col gap-1">
        <header class="flex w-full items-center justify-between">
            <h1 class="text-2xl font-semibold">
                Projects
            </h1>
            <template v-if="canOperateSubproject">
                <UButton
                    icon="i-heroicons-plus"
                    label="Add"
                    size="md"
                    color="white"
                    variant="solid"
                    :disabled="!isProjectActive"
                    @click="openCreateModal"
                />
            </template>
        </header>

        <section>
            <table class="table w-full table-auto border-separate border-spacing-y-4">
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
        </section>
    </div>
</template>
