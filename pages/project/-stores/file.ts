import type { FILE_TYPE, FileDto } from '~/types';

export const useProjectFileStore = defineStore('ProjectFileStore', () => {
    const attachments = ref<FileDto[]>([]);
    const reports = ref<FileDto[]>([]);

    const isReportsEmpty = computed(() => reports.value.length <= 0);
    const isAttachmentsEmpty = computed(() => attachments.value.length <= 0);
    const isFilesEmpty = computed(() => isReportsEmpty.value && isAttachmentsEmpty.value);

    function addFile(file: FileDto) {
        if (file.type === 'ATTACHMENT')
            attachments.value.unshift(file);
        else if (file.type === 'REPORT')
            reports.value.unshift(file);
    }

    function removeFile(type: FILE_TYPE, fileId: string) {
        if (type === 'ATTACHMENT')
            attachments.value = attachments.value.filter(attachment => attachment.id !== fileId);
        else if (type === 'REPORT')
            reports.value = reports.value.filter(report => report.id !== fileId);
    }

    function setFiles(files: FileDto[]) {
        attachments.value = [];
        reports.value = [];

        for (const file of files) {
            if (file.type === 'ATTACHMENT')
                attachments.value.unshift(file);
            else if (file.type === 'REPORT')
                reports.value.unshift(file);
        }
    }

    function reset() {
        attachments.value = [];
        reports.value = [];
    }

    return {
        attachments: readonly(attachments),
        reports: readonly(reports),
        isReportsEmpty,
        isAttachmentsEmpty,
        isFilesEmpty,
        setFiles,
        addFile,
        removeFile,
        reset,
    };
});
