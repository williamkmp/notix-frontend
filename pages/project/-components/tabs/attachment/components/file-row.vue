<script lang="ts" setup>
import type { FileDto, ServerData, UserDto } from '~/types';

type FileType = 'AUDIO' | 'VIDEO' | 'IMAGE' | 'TEXT' | 'DOCX' | 'PDF' | 'PPT' | 'EXCEL' | 'FILE';

const props = defineProps<{
    fileData: FileDto;
    deleteable: boolean;
}>();

defineEmits<{
    delete: [];
}>();

const dayJs = useDayjs();
const c = useRuntimeConfig().public;
const api = usePrivateApi();

const isLoading = ref(true);
const user = ref<UserDto>();

onMounted(async () => {
    isLoading.value = true;
    const response: ServerData<UserDto> = await api.get(`/api/user/${props.fileData.uploaderId}`);
    user.value = response.data;
    isLoading.value = false;
});

const userName = computed(() => {
    return user.value
        ? user.value.fullName
        : 'Anonymous';
});

const fileUrl = computed(() => `${c.API_BASE_URL}api/file/${props.fileData.id ?? '-1'}`);
const userAvatarUrl = computed(() => `${c.API_BASE_URL}api/file/${user.value?.imageId ?? '-1'}`);

const fileType = computed((): FileType => {
    const mimeType = props.fileData.contentType;
    const fileName = props.fileData.name;
    if (mimeType.startsWith('image')) {
        return 'IMAGE';
    }
    else if (mimeType.startsWith('audio')) {
        return 'AUDIO';
    }
    else if (mimeType.startsWith('video')) {
        return 'VIDEO';
    }
    else if (mimeType.startsWith('text')) {
        return 'TEXT';
    }
    else if (
        mimeType.endsWith('vnd.openxmlformats-officedocument.wordprocessingml.document')
        || mimeType.endsWith('vnd.ms-word.document.macroEnabled.12')
        || mimeType.endsWith('vnd.openxmlformats-officedocument.wordprocessingml.template')
        || mimeType.endsWith('vnd.ms-word.template.macroEnabled.12')
        || fileName.endsWith('.docx')
        || fileName.endsWith('.docm')
        || fileName.endsWith('.dotx')
        || fileName.endsWith('.dotm')
    ) {
        return 'DOCX';
    }
    else if (
        mimeType.endsWith('pdf')
        || fileName.endsWith('.pdf')
    ) {
        return 'PDF';
    }
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
    ) {
        return 'PPT';
    }
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
    ) {
        return 'EXCEL';
    }
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

const iconColor = computed(() => {
    if (fileType.value === 'AUDIO')
        return 'text-purple-400';
    if (fileType.value === 'VIDEO')
        return 'text-purple-400';
    if (fileType.value === 'IMAGE')
        return 'text-sky-400';
    if (fileType.value === 'TEXT')
        return 'text-slate-400';
    if (fileType.value === 'DOCX')
        return 'text-blue-600';
    if (fileType.value === 'PDF')
        return 'text-red-600';
    if (fileType.value === 'PPT')
        return 'text-orang-600';
    if (fileType.value === 'EXCEL')
        return 'text-green-600';
    else
        return 'text-gray-500';
});

const uploadDateTime = computed(() => dayJs(props.fileData.createdAt).format('DD MMM YYYY, hh:mm'));
</script>

<template>
    <UCard class="w-full">
        <template v-if="!isLoading">
            <div class="group flex size-full gap-4">
                <div class="flex items-center justify-center">
                    <UIcon class="text-5xl" :class="[iconColor]" :name="iconName" dynamic />
                </div>
                <div class="flex w-full flex-col items-start justify-center gap-0.5">
                    <span class="text-base font-semibold">{{ props.fileData.name }}</span>
                    <span class="text-xs font-normal opacity-75">{{ humanReadableFileSize(props.fileData.size) }}</span>
                    <span class="text-xs font-normal opacity-75">{{ uploadDateTime }}</span>
                    <div class="flex w-full items-center gap-1">
                        <UAvatar size="2xs" :src="userAvatarUrl" :alt="userName.toUpperCase()" />
                        <span class="text-xs">{{ userName }}</span>
                    </div>
                </div>
                <div class="flex flex-col items-center justify-between">
                    <template v-if="props.deleteable">
                        <UButton
                            variant="ghost"
                            size="md"
                            color="red"
                            icon="i-heroicons-x-circle"
                            :padded="false"
                            @click="$emit('delete')"
                        />
                    </template>
                    <template v-else>
                        <div />
                    </template>
                    <a :href="fileUrl" download>
                        <UButton
                            variant="ghost" icon="i-ic-baseline-download-for-offline" size="md"
                            :padded="false"
                        />
                    </a>
                </div>
            </div>
        </template>
        <template v-else>
            <USkeleton class="h-20 w-full" />
        </template>
    </UCard>
</template>
