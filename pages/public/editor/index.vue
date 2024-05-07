<script lang="ts" setup>
import { EditorContent, useEditor } from '@tiptap/vue-3';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import HighLight from '@tiptap/extension-highlight';
import HardBreak from '@tiptap/extension-hard-break';

const editorHTML = ref('<p></p>');
const editor = useEditor({
    content: editorHTML.value,
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
    onUpdate: () => {
        if (editor.value)
            editorHTML.value = editor.value.getHTML();
    },
});
</script>

<template>
    <div class="flex size-full items-center justify-center">
        <UContainer class="flex w-full items-start justify-center gap-4">
            <section class="flex w-full flex-col gap-2">
                <h1 class="text-xl font-bold">
                    Editor
                </h1>
                <UDivider />
                <EditorContent :editor="editor" />
            </section>

            <section class="flex w-full flex-col gap-2">
                <h1 class="text-xl font-bold">
                    HTML Content
                </h1>
                <UDivider />
                <div class="bg-gray-200 p-2">
                    <span>{{ editorHTML }}</span>
                </div>
            </section>
        </UContainer>
    </div>
</template>
