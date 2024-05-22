<script setup lang="ts">
import FileRow from './components/file-row.vue';
import { useAuthorityStore } from '~/pages/project/-stores/authority';
import { useProjectFileStore } from '~/pages/project/-stores/file';
import { useProjectStore } from '~/pages/project/-stores/project';

import type { FileDto, ServerData, USER_ROLE } from '~/types';

const fileStore = useProjectFileStore();
const authority = useAuthorityStore();
const project = useProjectStore();
const appStore = useAppStore();

const api = usePrivateApi();
const notif = useNotification();
const { $m } = useMessage();
const reportFileDialog = useFileDialog({
    directory: false,
    multiple: false,
    reset: true,
});
const attachmentFileDialog = useFileDialog({
    directory: false,
    multiple: false,
    reset: true,
});

const isUploadingAttachment = ref(false);
const isUploadingReport = ref(false);

reportFileDialog.onChange(files => doUpload('report', files));
attachmentFileDialog.onChange(files => doUpload('attachment', files));
async function doUpload(type: 'report' | 'attachment', files: FileList | null) {
    if (type === 'report')
        isUploadingReport.value = true;
    else if (type === 'attachment')
        isUploadingAttachment.value = true;

    try {
        const projectId = project.id!;
        if (files && files[0]) {
            const file = files[0];
            const response: ServerData<FileDto> = await api
                .postForm(
                    `/api/project/${projectId}/${type}`,
                    { file },
                );

            notif.ok({
                message: $m(response.message ?? 'upload_success'),
            });
        }
    }
    catch (error) {
        notif.error({
            title: 'Upload Failed',
            message: 'Please reload the page adn try again',
        });
    }
    finally {
        if (type === 'report')
            isUploadingReport.value = false;
        else if (type === 'attachment')
            isUploadingAttachment.value = false;
    }
}

function userCanDeleteFile(role: USER_ROLE, file: FileDto) {
    const userId = appStore.user!.id;
    if (role === 'PROJECT_MANAGER') {
        return true;
    }
    else if (file.uploaderId === userId) {
        return (file.type === 'ATTACHMENT' && role === 'DEVELOPER')
            || (file.type === 'REPORT' && role === 'TECHNICAL_WRITER');
    }
    return false;
}
</script>

<template>
    <div data-role="project-tab-container" class="size-full flex gap-5">
        <section data-role="reports-section" class="size-full flex flex-col gap-3">
            <header class="w-full flex justify-between">
                <h1 class="text-2xl font-semibold">
                    Reports
                </h1>
                <UButton
                    v-if="authority.userCanOpearteReports" :disabled="!project.isActive"
                    icon="i-heroicons-arrow-up-on-square" size="md" color="white" variant="solid"
                    @click="reportFileDialog.open"
                />
            </header>

            <div class="size-full flex flex-col gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 overflow-y-scroll">
                <template v-for="file in fileStore.reports" :key="file.id">
                    <FileRow :file-data="file" :deleteable="userCanDeleteFile(authority.role, file)" />
                </template>
            </div>
        </section>

        <UDivider orientation="vertical" />

        <section data-role="attachment-section" class="size-full flex flex-col gap-3">
            <header class="w-full flex justify-between">
                <h1 class="text-2xl font-semibold">
                    Attachments
                </h1>
                <UButton
                    v-if="authority.userCanOpearteAttachments" :disabled="!project.isActive"
                    icon="i-heroicons-arrow-up-on-square" size="md" color="white" variant="solid"
                    @click="attachmentFileDialog.open"
                />
            </header>

            <div class="size-full flex flex-col gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 overflow-y-scroll">
                <template v-for="file in fileStore.attachments" :key="file.id">
                    <FileRow :file-data="file" :deleteable="userCanDeleteFile(authority.role, file)" />
                </template>
            </div>
        </section>
    </div>
</template>
