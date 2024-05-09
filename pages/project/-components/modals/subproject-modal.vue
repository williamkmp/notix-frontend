<script setup lang="ts">
import { useProjectStore } from '../../-stores/project';
import { useSubprojectModalStore } from '../../-stores/subproject-modal';

const dayjs = useDayjs();
const socket = useSocketClientStore();
const projectStore = useProjectStore();
const subprojectModalStore = useSubprojectModalStore();

async function doCreateProject() {
    subprojectModalStore.isLoading = true;
    socket.send(
        `/project/${projectStore.id}/subproject.add`,
        {
            name: subprojectModalStore.form.name,
            endDate: dayjs(subprojectModalStore.form.range.end).endOf('day').toISOString(),
            startDate: dayjs(subprojectModalStore.form.range.start).startOf('day').toISOString(),
        },
    );
    subprojectModalStore.reset();
    subprojectModalStore.isLoading = false;
}
</script>

<template>
    <UModal v-model="subprojectModalStore.isOpen" :prevent-close="subprojectModalStore.isLoading">
        <UCard
            class="w-full" :ui="{
                header: { padding: 'px-8 py-4 sm:px-8 sm:py-4' },
                body: { padding: 'px-8 py-4 sm:px-8 sm:py-4' },
            }"
        >
            <template #header>
                <div class="flex w-full items-center gap-2">
                    <span class="text-2xl font-bold">
                        Create Project
                    </span>
                </div>
            </template>

            <template #default>
                <section class="flex w-full flex-col gap-4">
                    <section class="flex w-full flex-col">
                        <span class="text-base font-bold">Title</span>
                        <UFormGroup name="name" class="mt-2 w-full" :error="subprojectModalStore.error.name">
                            <UInput
                                v-model="subprojectModalStore.form.name" placeholder="Untitled"
                                :disabled="subprojectModalStore.isLoading"
                            />
                        </UFormGroup>
                    </section>

                    <section class="flex w-full flex-col">
                        <span class="text-base font-bold">Active Period</span>
                        <UFormGroup name="range" class="mt-2 w-full" :error="subprojectModalStore.error.range">
                            <RangeDatePicker
                                v-model="subprojectModalStore.form.range"
                                :min-date="$dayjs().startOf('day').toDate()" color="white" variant="solid"
                                :disabled="subprojectModalStore.isLoading"
                            />
                        </UFormGroup>
                    </section>

                    <UButton
                        label="Submit" type="submit" block variant="solid" class="mt-2"
                        :disabled="subprojectModalStore.isLoading" :loading="subprojectModalStore.isLoading"
                        @click="doCreateProject"
                    />
                </section>
            </template>
        </UCard>
    </UModal>
</template>
