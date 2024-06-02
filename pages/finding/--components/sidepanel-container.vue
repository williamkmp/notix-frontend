<template>
    <section data-role="finding-sidepanel" class="h-full w-[28rem] shrink-0 py-4 pl-4">
        <UCard class="size-full">
            <div class="flex size-full flex-col gap-2">
                <slot name="default" />
            </div>
        </UCard>
    </section>
</template>
