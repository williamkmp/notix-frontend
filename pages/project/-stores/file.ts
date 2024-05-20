import type { FileDto } from '~/types';

export const useProjectFileStore = defineStore('ProjectFileStore', () => {
    const attachments = ref<FileDto[]>([]);
    const reports = ref<FileDto[]>([]);

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
        attachments,
        reports,
        setFiles,
        reset,
    };
});
