<script setup lang="ts">
import type { StompSubscription } from '@stomp/stompjs';
import { HttpStatusCode } from 'axios';

import { usePageLoadingStore } from './-stores/page-loading';
import { useProjectStore } from './-stores/project';
import { useAuthorityStore } from './-stores/authority';
import { useProjectLogStore } from './-stores/log';
import { useProjectMemberStore } from './-stores/member';
import { useProjectInviteModalStore } from './-stores/invite-modal';
import { useProjectPictureModalStore } from './-stores/picture-modal';
import { useProjectSubprojectStore } from './-stores/subproject';
import { useSubprojectModalStore } from './-stores/subproject-modal';

// Components
import ProjectHeader from './-components/project-header.vue';
import ProjectTabs from './-components/tabs/index.vue';

// Modal Components
import InviteModal from './-components/modals/invite-modal.vue';
import PictureModal from './-components/modals/project-picture-modal.vue';
import SubprojectModal from './-components/modals/subproject-modal.vue';

// Layout Component
import { useProjectFileStore } from './-stores/file';
import AppPage from '~/layouts/-components/app-page.vue';

import type { FileActionDto, FileDto, LogDto, MemberActionDto, MemberDto, ProjectDto, ProjectHeaderDto, ServerData, ServerResponseError, SubprojectActionDto, SubprojectDto } from '~/types';

const app = useAppStore();
const socket = useSocketClientStore();
const project = useProjectStore();
const authority = useAuthorityStore();
const subproject = useProjectSubprojectStore();
const log = useProjectLogStore();
const member = useProjectMemberStore();
const inviteModal = useProjectInviteModalStore();
const projectPictureModal = useProjectPictureModalStore();
const subprojectModal = useSubprojectModalStore();
const fileStore = useProjectFileStore();
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
            api.get(`/api/project/${projectId}/files`),
        ]);

        const pageResponse = responses[0] as ServerData<ProjectHeaderDto>;
        const memberResponse = responses[1] as ServerData<MemberDto[]>;
        const logsResposne = responses[2] as ServerData<LogDto[]>;
        const subprojectsResponse = responses[3] as ServerData<SubprojectDto[]>;
        const filesResponse = responses[4] as ServerData<FileDto[]>;

        authority.setRole(pageResponse.data.role);
        project.watcher.ignoreUpdates(() => {
            project.id = pageResponse.data.id;
            project.title = pageResponse.data.name;
            project.ownerId = pageResponse.data.ownerId;
            project.imageId = pageResponse.data.imageId;
            project.startDate = dayjs(pageResponse.data.startDate);
            project.endDate = dayjs(pageResponse.data.endDate);
        });
        subproject.setSubprojectList(subprojectsResponse.data);
        member.list = memberResponse.data;
        log.list = logsResposne.data;
        fileStore.setFiles(filesResponse.data);
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
            socket.subscribe(`/topic/project/${projectId}/subprojects`, (payload: SubprojectActionDto) => {
                if (payload.action === 'ADD')
                    subproject.addSubproject(payload);
            }),
        );

        subscribtions.value.push(
            socket.subscribe(`/topic/project/${projectId}/files`, (payload: FileActionDto) => {
                if (payload.action === 'ADD')
                    fileStore.addFile(payload);
                else if (payload.action === 'DELETE')
                    fileStore.removeFile(payload.type, payload.id);
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
                            authority.setRole(payload.role);
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
                        message: 'Action cannot be done.',
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
    subprojectModal.reset();
    fileStore.reset();
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
            <div data-role="project-page" class="flex h-full justify-center px-20">
                <UContainer class="flex w-full flex-col gap-4 py-10 ">
                    <ProjectHeader />
                    <div class="grow">
                        <ProjectTabs />
                    </div>
                </UContainer>
            </div>
        </template>
    </AppPage>
    <InviteModal />
    <PictureModal />
    <SubprojectModal />
</template>
