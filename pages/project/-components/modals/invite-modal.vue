<script setup lang="ts">
import { HttpStatusCode } from 'axios';
import { z } from 'zod';
import { useProjectInviteModalStore } from '../../-stores/invite-modal';
import { useProjectStore } from '../../-stores/project';
import type { InviteDto, ServerResponseError, USER_ROLE } from '~/types';

const { $v } = useMessage();
const app = useAppStore();
const socket = useSocketClientStore();

const project = useProjectStore();
const inviteModal = useProjectInviteModalStore();

const memberForm = useFormDeclaration({
    schema: z.object({
        email: z.string({ required_error: $v('required') }).email($v('string_email')),
    }),
    onSubmit: async (form) => {
        const newEmail = form.data.email.trim();
        const isSelfEmail = (newEmail === app.user?.email);
        if (!isSelfEmail) {
            inviteModal.addInvite(newEmail);
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

async function doInviteMembers() {
    inviteModal.isSubmitting = true;
    try {
        const projectId = project.id;
        const invites: Array<InviteDto> = inviteModal.invites;
        socket.send(`/project/${projectId}/member.add`, invites);
        memberForm.reset();
    }
    catch (error) {
        console.error('Error creating project:', error);
    }
    inviteModal.reset();
}
</script>

<template>
    <UModal v-model="inviteModal.isOpen" :prevent-close="inviteModal.isSubmitting">
        <UCard
            class="w-full" :ui="{
                header: { padding: 'px-8 py-4 sm:px-8 sm:py-4' },
                body: { padding: 'px-8 py-4 sm:px-8 sm:py-4' },
            }"
        >
            <template #header>
                <div class="flex w-full items-center gap-2">
                    <span class="text-2xl font-bold">
                        Invite People
                    </span>
                </div>
            </template>

            <template #default>
                <section class="flex w-full flex-col gap-4">
                    <section class="flex w-full flex-col">
                        <span class="text-base font-bold">Members</span>
                        <span class="text-base font-normal">Invite new members to project by email</span>
                        <UiForm :form="memberForm" class="flex w-full items-start gap-4">
                            <UFormGroup name="email" class="mt-2 w-full">
                                <UInput
                                    v-model="memberForm.state.email" icon="i-heroicons-envelope"
                                    placeholder="name@email.com" :disabled="inviteModal.isSubmitting"
                                />
                            </UFormGroup>
                            <UButton
                                color="white" variant="solid" type="submit" label="Add" icon="i-heroicons-plus"
                                class="mt-2" :disabled="inviteModal.isSubmitting"
                            />
                        </UiForm>

                        <div
                            class="mt-5 h-56 max-h-56 w-full flex-col overflow-y-auto rounded-md border border-gray-200"
                        >
                            <template v-if="inviteModal.isInvitesEmpty">
                                <div class="flex size-full items-center justify-center">
                                    <section class="flex flex-col items-center justify-center opacity-70">
                                        <UIcon name="i-heroicons-no-symbol" class="text-6xl" />
                                        <span class="text-base font-semibold">Empty</span>
                                        <span class="text-sm">Add members by email, or skip this step.</span>
                                    </section>
                                </div>
                            </template>
                            <template v-else>
                                <div
                                    v-for="(invite, index) in inviteModal.invites" :key="invite.email"
                                    class="group flex w-full items-center justify-between border-b border-gray-200 px-4 py-1"
                                >
                                    <span class="text-sm font-medium">{{ invite.email }}</span>

                                    <UDropdown
                                        :items="[[
                                            {
                                                label: 'Member',
                                                icon: 'i-heroicons-eye',
                                                click: () => inviteModal.updateInviteRoleAt(index, 'MEMBER'),
                                            },
                                            {
                                                label: 'Developer',
                                                icon: 'i-heroicons-code-bracket',
                                                click: () => inviteModal.updateInviteRoleAt(index, 'DEVELOPER'),
                                            },
                                            {
                                                label: 'Writer',
                                                icon: 'i-heroicons-pencil',
                                                click: () => inviteModal.updateInviteRoleAt(index, 'TECHNICAL_WRITER'),
                                            },
                                            {
                                                label: 'Remove',
                                                icon: 'i-heroicons-x-circle',
                                                click: () => inviteModal.removeInviteAt(index),
                                            },
                                        ]]" :popper="{ placement: 'right' }" :disabled="inviteModal.isSubmitting"
                                    >
                                        <UButton
                                            color="white" :label="roleDisplayOf(invite.role)" variant="ghost"
                                            trailing-icon="i-heroicons-chevron-down-20-solid" size="xs"
                                        />
                                    </UDropdown>
                                </div>
                            </template>
                        </div>
                    </section>

                    <UButton
                        label="Submit" type="submit" block variant="solid" class="mt-2"
                        :disabled="inviteModal.isSubmitting" :loading="inviteModal.isSubmitting"
                        @click="doInviteMembers"
                    />
                </section>
            </template>
        </UCard>
    </UModal>
</template>
