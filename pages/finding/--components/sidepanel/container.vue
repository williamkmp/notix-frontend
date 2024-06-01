<template>
    <section data-role="finding-sidepanel" class="h-full w-[27rem] shrink-0">
        <div class="size-full py-4 pl-4">
            <UCard class="flex size-full flex-col">
                <slot name="default" />
            </UCard>
        </div>
    </section>
</template>
