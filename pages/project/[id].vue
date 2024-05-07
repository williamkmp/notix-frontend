<script setup lang="ts">
import type { StompSubscription } from '@stomp/stompjs';
import { HttpStatusCode } from 'axios';
import { usePageLoadingStore } from './-stores/page-loading';
import { useProjectStore } from './-stores/project';
import { useAuthorityStore } from './-stores/authority';
import { useProjectLogStore } from './-stores/log';
import { useProjectMemberStore } from './-stores/member';
import { useProjectInviteModalStore } from './-stores/invite-modal';
import TimelineTab from './-components/timeline-tab.vue';
import ProjectsTab from './-components/projects-tab.vue';
import MembersTab from './-components/members-tab.vue';
import AttachmentsTab from './-components/attachments-tab.vue';
import UpdatesTab from './-components/update-logs-tab.vue';
import ProjectHeader from './-components/project-header.vue';
import InviteModal from './-components/invite-modal.vue';
import PictureModal from './-components/project-picture-modal.vue';
import { useProjectPictureModalStore } from './-stores/picture-modal';
import type { LogDto, MemberActionDto, MemberDto, ProjectDto, ProjectHeaderDto, ServerData, ServerResponseError } from '~/types';
import AppPage from '~/layouts/-components/app-page.vue';

const app = useAppStore();
const socket = useSocketClientStore();
const project = useProjectStore();
const authority = useAuthorityStore();
const log = useProjectLogStore();
const member = useProjectMemberStore();
const inviteModal = useProjectInviteModalStore();
const projectPictureModal = useProjectPictureModalStore();
const loading = usePageLoadingStore();

const notif = useNotification();
const route = useRoute();
const api = usePrivateApi();
const dayjs = useDayjs();
const subscribtions = ref<StompSubscription[]>([]);
const projectId = route.params.id;

onMounted(async () => {
    loading.isLoading = true;
    try {
        const responses = await Promise.all([
            api.get(`/api/project/${projectId}`),
            api.get(`/api/project/${projectId}/members`),
            api.get(`/api/project/${projectId}/logs`),
            api.get(`/api/project/${projectId}/subprojects`),
        ]);

        const pageResponse = responses[0] as ServerData<ProjectHeaderDto>;
        const memberResponse = responses[1] as ServerData<MemberDto[]>;
        const logsResposne = responses[2] as ServerData<LogDto[]>;

        authority.setRole(pageResponse.data.role);
        project.watcher.ignoreUpdates(() => {
            project.id = pageResponse.data.id;
            project.title = pageResponse.data.name;
            project.ownerId = pageResponse.data.ownerId;
            project.imageId = pageResponse.data.imageId;
            project.startDate = dayjs(pageResponse.data.startDate);
            project.endDate = dayjs(pageResponse.data.endDate);
        });
        member.list = memberResponse.data;
        log.list = logsResposne.data;
        loading.isLoading = false;

        subscribtions.value.push(
            socket.subscribe(`/topic/project/${projectId}`, (payload: ProjectDto, header) => {
                if (app.sessionId !== header.SessionUUID) {
                    project.watcher.ignoreUpdates(() => {
                        project.title = payload.name;
                        project.ownerId = payload.ownerId;
                        project.imageId = payload.imageId;
                        project.startDate = dayjs(payload.startDate);
                        project.endDate = dayjs(payload.endDate);
                    });
                }
            }),
        );

        subscribtions.value.push(
            socket.subscribe(`/topic/project/${projectId}/logs`, (payload: LogDto) => {
                log.list.unshift(payload);
            }),
        );

        subscribtions.value.push(
            socket.subscribe(`/topic/project/${projectId}/members`, (payload: MemberActionDto) => {
                if (payload.action === 'ADD') {
                    member.list.push({
                        id: payload.id,
                        email: payload.email,
                        fullName: payload.fullName,
                        role: payload.role,
                        imageId: payload.imageId,
                    });
                }
                else if (payload.action === 'UPDATE') {
                    const targetMember = member.list.find(user => user.id === payload.id);
                    if (targetMember) {
                        targetMember.imageId = payload.imageId;
                        targetMember.fullName = payload.fullName;
                        targetMember.email = payload.email;
                        targetMember.role = payload.role;

                        if (payload.id === app.user?.id)
                            authority.role = payload.role;
                    }
                }
                else if (payload.action === 'DELETE') {
                    const memberIndex = member.list.findIndex(user => user.id === payload.id);
                    if (memberIndex >= 0)
                        member.list.splice(memberIndex, 1);
                }
            }),
        );

        subscribtions.value.push(
            socket.subscribe(`/topic/user/${app.user?.id}/project/${projectId}/errors`, (payload: ServerResponseError) => {
                if (payload.status === HttpStatusCode.Forbidden) {
                    notif.warn({
                        title: 'Forbidden',
                        message: 'Action not permitted',
                    });
                }
                else if (payload.status === HttpStatusCode.Unauthorized) {
                    navigateTo('/');
                    notif.error({
                        title: 'Unauthorized',
                        message: 'Cannot access the project',
                    });
                }
                else if (payload.status === HttpStatusCode.NotFound) {
                    navigateTo('/');
                    notif.warn({
                        title: 'Not Found',
                        message: 'Project not found',
                    });
                }
                else if (payload.status === HttpStatusCode.Conflict) {
                    notif.error({
                        title: 'Error',
                        message: 'Data conflict detected, please refresh page',
                    });
                }
            }),
        );
    }
    catch (error) {
        const errorResponse = error as ServerResponseError;
        if (errorResponse.status === HttpStatusCode.Forbidden) {
            navigateTo('/');
            notif.error({
                title: 'Unauthorized',
                message: 'Cannot access the project',
            });
        }
        else if (errorResponse.status === HttpStatusCode.NotFound) {
            navigateTo('/');
            notif.warn({
                title: 'Not Found',
                message: 'Project not found',
            });
        }
        console.error('Project load error', error);
    }
});

function pageCleanup() {
    for (const subscribtion of subscribtions.value)
        subscribtion.unsubscribe();
    inviteModal.reset();
    projectPictureModal.reset();
}

onBeforeRouteLeave(pageCleanup);
onBeforeRouteUpdate(pageCleanup);
</script>

<template>
    <AppPage>
        <template #left-header>
            <template v-if="!loading.isLoading">
                <h1 class="text-base font-semibold">
                    {{ project.title }}
                </h1>
            </template>
            <template v-else>
                <USkeleton class="h-5 w-96 rounded-lg" />
            </template>
        </template>

        <template #body>
            <div data-role="project-page" class="flex justify-center px-20">
                <UContainer class="my-10 flex w-full flex-col gap-4">
                    <ProjectHeader />
                    <UTabs
                        class="mt-2" :items="[
                            { label: 'Projects' },
                            { label: 'Members' },
                            { label: 'Reports & Attachments' },
                            { label: 'Updates' },
                        ]"
                    >
                        <template #item="{ item }">
                            <section class="mt-4 w-full">
                                <template v-if="item.label === 'Projects'">
                                    <ProjectsTab />
                                </template>
                                <template v-else-if="item.label === 'Members'">
                                    <MembersTab />
                                </template>
                                <template v-else-if="item.label === 'Reports & Attachments'">
                                    <AttachmentsTab />
                                </template>
                                <template v-else-if="item.label === 'Updates'">
                                    <UpdatesTab />
                                </template>
                            </section>
                        </template>
                    </UTabs>
                </UContainer>
            </div>
        </template>
    </AppPage>
    <InviteModal />
    <PictureModal />
</template>
