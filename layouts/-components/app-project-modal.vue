<script setup lang="ts">
import { HttpStatusCode } from 'axios';
import { z } from 'zod';
import type { ProjectDto, ServerData, ServerResponseError, USER_ROLE } from '~/types';

const { $v } = useMessage();
const projectModal = useProjectModalStore();
const api = usePrivateApi();
const dayjs = useDayjs();
const app = useAppStore();

const memberForm = useFormDeclaration({
    schema: z.object({
        email: z.string({ required_error: $v('required') }).email($v('string_email')),
    }),
    onSubmit: async (form) => {
        const newEmail = form.data.email.trim();
        const isSelfEmail = (newEmail === app.user?.email);
        if (!isSelfEmail) {
            projectModal.addEmail(newEmail);
            memberForm.reset();
        }
        else {
            const error: ServerResponseError = {
                status: HttpStatusCode.BadRequest,
                error: { email: 'Cannot add own self' },
            };
            throw error;
        }
    },
});

function roleDisplayOf(role: USER_ROLE) {
    switch (role) {
        case 'DEVELOPER':
            return 'Developer';
        case 'MEMBER':
            return 'Member';
        case 'TECHNICAL_WRITER':
            return 'Writer';
    }
}

async function doCreateProject() {
    projectModal.isSubmitting = true;
    try {
        const response: ServerData<ProjectDto> = await api.post(
            '/api/project',
            {
                name: projectModal.form.title,
                endDate: dayjs(projectModal.form.range.end).endOf('day').toISOString(),
                startDate: dayjs(projectModal.form.range.start).startOf('day').toISOString(),
                invites: projectModal.form.invites,
            },
        );
        // eslint-disable-next-line no-console
        console.log(response);
        projectModal.isOpen = false;
        projectModal.reset();
        memberForm.reset();
    }
    catch (error) {
        const response = error as ServerResponseError;
        console.error('Error creating project:', error);
        if (response.error?.name)
            projectModal.error.title = $v(response.error.name);
        if (response.error?.startDate)
            projectModal.error.range = $v(response.error.startDate);
        if (response.error?.endDate)
            projectModal.error.range = $v(response.error.endDate);
    }
    projectModal.isSubmitting = false;
}
</script>

<template>
    <UModal v-model="projectModal.isOpen" :prevent-close="projectModal.isSubmitting">
        <UCard
            class="w-full"
            :ui="{
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
                        <UFormGroup name="name" class="mt-2 w-full" :error="projectModal.error.title">
                            <UInput v-model="projectModal.form.title" placeholder="Untitled" :disabled="projectModal.isSubmitting" />
                        </UFormGroup>
                    </section>

                    <section class="flex w-full flex-col">
                        <span class="text-base font-bold">Active Period</span>
                        <UFormGroup name="range" class="mt-2 w-full" :error="projectModal.error.range">
                            <RangeDatePicker v-model="projectModal.form.range" :min-date="$dayjs().startOf('day').toDate()" color="white" variant="solid" :disabled="projectModal.isSubmitting" />
                        </UFormGroup>
                    </section>

                    <section class="flex w-full flex-col">
                        <span class="text-base font-bold">Members</span>
                        <UiForm :form="memberForm" class="flex w-full items-start gap-2">
                            <UFormGroup name="email" class="mt-2 w-full">
                                <UInput v-model="memberForm.state.email" icon="i-heroicons-envelope" placeholder="name@email.com" :disabled="projectModal.isSubmitting" />
                            </UFormGroup>
                            <UButton color="white" variant="solid" type="submit" label="Add" icon="i-heroicons-plus" class="mt-2" :disabled="projectModal.isSubmitting" />
                        </UiForm>

                        <div class="mt-3 h-[14rem] max-h-[14rem] w-full flex-col overflow-y-auto rounded-md border border-gray-200">
                            <template v-if="projectModal.isMembersEmpty">
                                <div class="flex size-full items-center justify-center">
                                    <section class="flex flex-col items-center justify-center opacity-70">
                                        <UIcon name="i-heroicons-no-symbol" class="text-6xl" />
                                        <span class="text-base font-semibold">Empty</span>
                                        <span class="text-sm">Add members by email, or skip this step.</span>
                                    </section>
                                </div>
                            </template>
                            <template v-else>
                                <div v-for="(invite, index) in projectModal.form.invites" :key="invite.email" class="group flex w-full items-center justify-between border-b border-gray-200 px-4 py-1">
                                    <span class="text-sm font-medium">{{ invite.email }}</span>

                                    <UDropdown
                                        :items="[[
                                            {
                                                label: 'Member',
                                                icon: 'i-heroicons-user',
                                                click: () => projectModal.updateRoleAt(index, 'MEMBER'),
                                            },
                                            {
                                                label: 'Developer',
                                                icon: 'i-heroicons-code-bracket',
                                                click: () => projectModal.updateRoleAt(index, 'DEVELOPER'),
                                            },
                                            {
                                                label: 'Writer',
                                                icon: 'i-heroicons-pencil',
                                                click: () => projectModal.updateRoleAt(index, 'TECHNICAL_WRITER'),
                                            },
                                            {
                                                label: 'Remove',
                                                icon: 'i-heroicons-x-circle',
                                                click: () => projectModal.removeInviteAt(index),
                                            },
                                        ]]"
                                        :popper="{ placement: 'right' }"
                                        :disabled="projectModal.isSubmitting"
                                    >
                                        <UButton color="white" :label="roleDisplayOf(invite.role)" variant="ghost" trailing-icon="i-heroicons-chevron-down-20-solid" size="xs" />
                                    </UDropdown>
                                </div>
                            </template>
                        </div>
                    </section>

                    <UButton label="Submit" type="submit" block variant="solid" class="mt-2" :disabled="projectModal.isSubmitting" :loading="projectModal.isSubmitting" @click="doCreateProject" />
                </section>
            </template>
        </UCard>
    </UModal>
</template>
