<script lang="ts" setup>
import { useAuthorityStore } from '../../../-stores/authority';
import { useProjectInviteModalStore } from '../../../-stores/invite-modal';
import { useProjectMemberStore } from '../../../-stores/member';
import { useProjectStore } from '../../../-stores/project';
import type { MemberDto, USER_ROLE } from '~/types';

const socket = useSocketClientStore();
const inviteModal = useProjectInviteModalStore();
const project = useProjectStore();
const authority = useAuthorityStore();
const members = useProjectMemberStore();
const className = {
    header: 'text-left opacity-50 first:pl-4 last:pr-4',
    body: 'py-3 text-left first:pl-4 last:pr-4 first:rounded-l-lg last:rounded-r-lg first:border-l last:border-r border-y border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900',
};

const memberList = computed(() => {
    const sortedByName = members.list.toSorted((userA, userB) => {
        const nameA = userA.fullName.toLocaleLowerCase();
        const nameB = userB.fullName.toLocaleLowerCase();
        return nameA > nameB ? 1 : -1;
    });
    return sortedByName.filter(user => user.role !== 'PROJECT_MANAGER');
});

const isProjectActive = computed(() => project.isActive);

function roleDisplayOf(role: USER_ROLE) {
    switch (role) {
        case 'DEVELOPER':
            return 'Developer';
        case 'MEMBER':
            return 'Member';
        case 'TECHNICAL_WRITER':
            return 'Writer';
        case 'PROJECT_MANAGER':
            return 'Manager';
    }
}

function roleIconOf(role: USER_ROLE) {
    switch (role) {
        case 'DEVELOPER':
            return 'i-heroicons-code-bracket';
        case 'MEMBER':
            return 'i-heroicons-user';
        case 'TECHNICAL_WRITER':
            return 'i-heroicons-pencil';
        case 'PROJECT_MANAGER':
            return 'i-heroicons-briefcase';
    }
}

function updateMemberRole(member: MemberDto, newRole: USER_ROLE) {
    socket.send(`/project/${project.id}/member.update`, {
        id: member.id,
        fullName: member.fullName,
        email: member.email,
        imageId: member.imageId,
        role: newRole,
    } as MemberDto);
}

function deleteMember(member: MemberDto) {
    if (member) {
        socket.send(`/project/${project.id}/member.delete`, {
            id: member.id,
            fullName: member.fullName,
            email: member.email,
            imageId: member.imageId,
        } as MemberDto);
    }
}
</script>

<template>
    <div data-role="project-tab-container" class="flex size-full flex-col gap-1">
        <header class="flex w-full items-center justify-between">
            <h1 class="text-2xl font-semibold">
                Members
            </h1>
            <UButton
                v-if="authority.userCanOpearteMember" icon="i-heroicons-user-plus" label="Invite" size="md"
                color="white" variant="solid" :disabled="!isProjectActive" @click="inviteModal.isOpen = true"
            />
        </header>

        <div class="size-full">
            <template v-if="memberList.length > 0">
                <table class="table w-full table-auto border-separate border-spacing-y-4">
                    <thead>
                        <th :class="className.header">
                            Profile
                        </th>
                        <th :class="className.header">
                            Role
                        </th>
                    </thead>
                    <tbody>
                        <template v-for="member in memberList" :key="member.id">
                            <tr>
                                <td :class="className.body">
                                    <div class="flex items-center gap-4">
                                        <UAvatar
                                            :alt="member.fullName.toUpperCase()" size="md"
                                            chip-position="bottom-right" chip-color="green"
                                        />
                                        <div class="flex flex-col">
                                            <span class="text-sm font-semibold">{{ member.fullName }}</span>
                                            <span class="text-sm font-normal opacity-60">{{ member.email }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td :class="className.body">
                                    <UDropdown
                                        :items="[[
                                            {
                                                label: roleDisplayOf('MEMBER'),
                                                icon: roleIconOf('MEMBER'),
                                                click: () => updateMemberRole(member, 'MEMBER'),
                                            },
                                            {
                                                label: roleDisplayOf('DEVELOPER'),
                                                icon: roleIconOf('DEVELOPER'),
                                                click: () => updateMemberRole(member, 'DEVELOPER'),
                                            },
                                            {
                                                label: roleDisplayOf('TECHNICAL_WRITER'),
                                                icon: roleIconOf('TECHNICAL_WRITER'),
                                                click: () => updateMemberRole(member, 'TECHNICAL_WRITER'),
                                            },
                                            {
                                                label: 'Remove',
                                                icon: 'i-heroicons-x-circle',
                                                click: () => deleteMember(member),
                                            },
                                        ]]" :popper="{ placement: 'right' }"
                                        :disabled="!authority.userCanOpearteMember"
                                    >
                                        <UButton
                                            class="w-full" color="gray" :label="roleDisplayOf(member.role)"
                                            variant="ghost" :icon="roleIconOf(member.role)"
                                            :trailing-icon="authority.userCanOpearteMember ? 'i-heroicons-chevron-down-20-solid' : undefined "
                                            size="md"
                                        />
                                    </UDropdown>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </template>
            <template v-else>
                <div class="flex size-full items-center justify-center">
                    <section class="flex flex-col items-center justify-center opacity-70">
                        <UIcon name="i-heroicons-no-symbol" class="text-6xl" />
                        <span class="text-base font-semibold">Empty</span>
                        <span class="text-base">Add members by email</span>
                    </section>
                </div>
            </template>
        </div>
    </div>
</template>
