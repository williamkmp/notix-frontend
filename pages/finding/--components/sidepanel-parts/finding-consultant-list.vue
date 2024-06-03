<template>
    <section data-role="finding-consultant-list" class="flex size-full grow flex-col gap-2">
        <header>
            <span class="text-sm font-bold"> Consultants</span>
        </header>

        <USelectMenu trailing-icon="i-heroicons-plus" placeholder="Enter email" />

        <UCard class="mt-1 size-full" :ui="{ body: { base: 'size-full' } }" />
    </section>
</template>
