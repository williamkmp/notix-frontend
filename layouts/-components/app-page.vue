<script setup lang="ts">
const sideMenu = useSideMenuStore();
const shortcut = useShortcuts();
</script>

<template>
    <div class="flex size-full flex-col">
        <header class="flex w-full items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-800">
            <!-- Left Control -->
            <section class="flex items-center gap-2">
                <UTooltip
                    :text="sideMenu.isOpen ? 'Close Menu' : 'Open menu'"
                    :shortcuts="[shortcut.metaSymbol.value, '\\']"
                    :popper="{ placement: 'bottom' }"
                >
                    <UButton
                        :icon="sideMenu.isOpen ? 'i-heroicons-chevron-double-left' : 'i-heroicons-chevron-double-right'"
                        color="white"
                        size="md"
                        variant="soft"
                        @click="sideMenu.toggleOpen"
                    />
                </UTooltip>

                <slot name="left-header" />
            </section>

            <!-- Right Control -->
            <section class="flex items-center gap-2">
                <slot name="right-header" />
            </section>
        </header>

        <!-- Body -->
        <section class="h-full grow overflow-y-scroll">
            <slot name="body" />
        </section>
    </div>
</template>
