<script setup lang="ts">
const searchModal = useSearchModalStore();
</script>

<template>
    <UModal v-model="searchModal.isOpen">
        <h1>Search Modal</h1>
    </UModal>
</template>
