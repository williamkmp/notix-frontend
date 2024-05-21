<script lang="ts" setup>
import dayjs from 'dayjs';
import type { FileDto } from '~/types';

type FileType = 'AUDIO' | 'VIDEO' | 'IMAGE' | 'TEXT' | 'DOCX' | 'PDF' | 'PPT' | 'EXCEL' | 'FILE';

const props = defineProps<{
    fileData: FileDto;
    deleteable: boolean;
}>();

const dayJs = useDayjs();

const fileType = computed((): FileType => {
    const mimeType = props.fileData.contentType;
    const fileName = props.fileData.name;
    if (mimeType.startsWith('image'))
        return 'IMAGE';
    else if (mimeType.startsWith('audio'))
        return 'AUDIO';
    else if (mimeType.startsWith('video'))
        return 'VIDEO';
    else if (mimeType.startsWith('text'))
        return 'TEXT';
    else if (
        mimeType.endsWith('vnd.openxmlformats-officedocument.wordprocessingml.document')
        || mimeType.endsWith('vnd.ms-word.document.macroEnabled.12')
        || mimeType.endsWith('vnd.openxmlformats-officedocument.wordprocessingml.template')
        || mimeType.endsWith('vnd.ms-word.template.macroEnabled.12')
        || fileName.endsWith('.docx')
        || fileName.endsWith('.docm')
        || fileName.endsWith('.dotx')
        || fileName.endsWith('.dotm')
    )
        return 'DOCX';
    else if (
        mimeType.endsWith('pdf')
        || fileName.endsWith('.pdf')
    )
        return 'PDF';
    else if (
        mimeType.endsWith('application/vnd.openxmlformats-officedocument.presentationml.presentation')
        || mimeType.endsWith('application/vnd.ms-powerpoint.presentation.macroEnabled.12')
        || mimeType.endsWith('application/vnd.openxmlformats-officedocument.presentationml.slideshow')
        || mimeType.endsWith('application/vnd.ms-powerpoint.slideshow.macroEnabled.12')
        || mimeType.endsWith('application/vnd.openxmlformats-officedocument.presentationml.template')
        || mimeType.endsWith('application/vnd.ms-powerpoint.template.macroEnabled.12')
        || mimeType.endsWith('application/vnd.ms-powerpoint.addin.macroEnabled.12')
        || mimeType.endsWith('application/vnd.openxmlformats-officedocument.presentationml.slide')
        || mimeType.endsWith('application/vnd.ms-powerpoint.slide.macroEnabled.12')
        || fileName.endsWith('.pptx')
        || fileName.endsWith('.pptm')
        || fileName.endsWith('.ppsx')
        || fileName.endsWith('.ppsm')
        || fileName.endsWith('.potx')
        || fileName.endsWith('.potm')
        || mimeType.endsWith('.ppam')
        || mimeType.endsWith('.sldx')
        || mimeType.endsWith('.sldm')
    )
        return 'PPT';
    else if (
        mimeType.endsWith('vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        || mimeType.endsWith('vnd.ms-excel.sheet.macroEnabled.12')
        || mimeType.endsWith('vnd.openxmlformats-officedocument.spreadsheetml.template')
        || mimeType.endsWith('vnd.ms-excel.template.macroEnabled.12')
        || mimeType.endsWith('vnd.ms-excel.sheet.binary.macroEnabled.12')
        || mimeType.endsWith('vnd.ms-excel.addin.macroEnabled.12')
        || fileName.endsWith('.xlsx')
        || fileName.endsWith('.xlsm')
        || fileName.endsWith('.xltx')
        || fileName.endsWith('.xltm')
        || fileName.endsWith('.xlsb')
        || fileName.endsWith('.xlam')
    )
        return 'EXCEL';
    return 'FILE';
});

const iconName = computed(() => {
    if (fileType.value === 'AUDIO')
        return 'i-mdi-file-music';
    if (fileType.value === 'VIDEO')
        return 'i-mdi-file-video';
    if (fileType.value === 'IMAGE')
        return 'i-mdi-file-image';
    if (fileType.value === 'TEXT')
        return 'i-mdi-file-document';
    if (fileType.value === 'DOCX')
        return 'i-mdi-microsoft-word';
    if (fileType.value === 'PDF')
        return 'i-mdi-file-pdf';
    if (fileType.value === 'PPT')
        return 'i-mdi-microsoft-powerpoint';
    if (fileType.value === 'EXCEL')
        return 'i-mdi-microsoft-excel';
    else
        return 'i-mdi-folder-zip';
});

const uploadDateTime = computed(() => dayJs(props.fileData.createdAt).format('DD MMM YYYY, hh:mm'));
</script>

<template>
    <div class="w-full bg-white rounded-md flex overflow-hidden py-2 px-3 gap-4 ">
        <div class="flex items-center justify-center">
            <UIcon class="text-3xl" :name="iconName" dynamic />
        </div>
        <div class="h-full flex flex-col items-start justify-center">
            <span class="text-base font-medium">
                {{ props.fileData.name }}
            </span>
            <span class="text-xs font-normal opacity-75">
                {{ humanReadableFileSize(props.fileData.size) }}
            </span>
            <span class="text-xs font-normal opacity-75">
                {{ uploadDateTime }}
            </span>
            <span />
        </div>
    </div>
</template>
