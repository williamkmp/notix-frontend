<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3';
import Mustache from 'mustache';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import HighLight from '@tiptap/extension-highlight';
import HardBreak from '@tiptap/extension-hard-break';
import type { LogDto, ProjectDto, ServerData, SubprojectDto, UserDto } from '~/types';

const props = defineProps<{ log: LogDto }>();
const api = usePrivateApi();
const dayjs = useDayjs();

const updater = ref<UserDto>();
const isLoading = ref(true);
const imageUrl = computed(() => {
    if (updater.value) {
        const imageId = updater.value.imageId;
        return imageId !== undefined
            ? `/api/file/${imageId}`
            : undefined;
    }
});

const displayedTime = computed(() => {
    return dayjs(props.log.createdAt).format('ddd, MMM D, YYYY HH:mm');
});

const editor = useEditor({
    content: '<p>Loading...</p>',
    editable: false,
    extensions: [
        Document,
        Paragraph,
        Text,
        Underline,
        Bold,
        Italic,
        HardBreak,
        HighLight.configure({ HTMLAttributes: { class: 'bg-sky-100 rounded-none px-0.5' } }),
    ],
});

onMounted(async () => {
    isLoading.value = true;
    if (props.log.userId && editor.value) {
        const userId = props.log.userId;
        const projectId = props.log.projectId;
        const subprojectId = props.log.subprojectId;

        let user: UserDto | undefined;
        let project: ProjectDto | undefined;
        let subproject: SubprojectDto | undefined;

        if (userId) {
            try {
                const response: ServerData<UserDto> = await api.get(`/api/user/${userId}`);
                user = response.data;
                updater.value = response.data;
            }
            catch (error) { }
        }

        if (projectId) {
            try {
                const response: ServerData<ProjectDto> = await api.get(`/api/project/${projectId}`);
                project = {
                    id: response.data.id,
                    name: response.data.name,
                    ownerId: response.data.ownerId,
                    endDate: dayjs(response.data.endDate).format('DD MMM, YYYY'),
                    startDate: dayjs(response.data.startDate).format('DD MMM, YYYY'),
                };
            }
            catch (error) { }
        }

        if (subprojectId) {
            try {
                const response: ServerData<SubprojectDto> = await api.get(`/api/subproject/${projectId}`);
                subproject = response.data;
            }
            catch (error) { }
        }

        const message = decodeURI(props.log.message);
        const renderedMessage = Mustache.render(message, { user, project, subproject });
        editor.value.commands.setContent(renderedMessage);
    }
    isLoading.value = false;
});
</script>

<template>
    <div class="flex w-full flex-col">
        <div
            class="flex items-start gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
        >
            <template v-if="isLoading">
                <USkeleton class="size-10 rounded-full" />
                <div class="flex flex-col gap-2">
                    <USkeleton class="h-5 w-32 rounded-md" />
                    <USkeleton class="h-5 w-32 rounded-md" />
                </div>
            </template>
            <template v-else>
                <UAvatar
                    :src="imageUrl"
                    :alt="updater?.fullName.toLocaleUpperCase() ?? 'Anonymous'" size="xl"
                />
                <div class="flex flex-col">
                    <span class="text-lg font-semibold">{{ props.log.title }}</span>
                    <EditorContent :editor="editor" />
                </div>
            </template>
        </div>
        <span class="w-full py-1 text-right text-sm opacity-70">{{ displayedTime }}</span>
    </div>
</template>
