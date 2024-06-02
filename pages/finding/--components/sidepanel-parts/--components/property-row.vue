<template>
    <div class="col-span-2 grid grid-cols-subgrid ">
        <div class="size-full">
            <slot name="left" />
        </div>

        <div class="size-full">
            <slot name="right" />
        </div>
    </div>
</template>
