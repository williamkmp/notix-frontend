<template>
    <div class="relative flex h-screen w-screen flex-col items-center justify-center">
        <header class="h-4 w-full bg-primary-400 dark:bg-primary-700" />
        <!-- Logo -->
        <section class="absolute left-0 top-0 ml-8 mt-8">
            <span class="select-none font-semibold tracking-widest">
                NOTIX.
            </span>
        </section>

        <section class="flex size-full items-center justify-center p-8">
            <slot />
        </section>

        <footer class="h-4 w-full bg-primary-400 dark:bg-primary-700" />
        <UNotifications />
    </div>
</template>
