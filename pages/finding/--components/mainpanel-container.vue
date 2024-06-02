<template>
    <section data-role="finding-mainpanel" class="flex size-full flex-col gap-2 py-4 pr-4">
        <!--  -->
        <div class="w-full grow-0">
            <slot name="header" />
        </div>

        <div class="size-full grow">
            <UCard class="size-full">
                <slot name="body" />
            </UCard>
        </div>
    </section>
</template>
