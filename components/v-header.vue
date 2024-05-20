<script setup lang="ts">

import type { PropType } from 'vue';
import type { UserDto } from '../types/_dto';
import type { RangeDatePickerModel } from '~/types';

const BASE_URL = useRuntimeConfig().public.API_BASE_URL;
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },

  onClickPictureModal: {
    type: Function,
    required: false,
  },
  userCanUpdateHeader: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: Object as PropType<string | boolean | undefined>,
    
  },
  userCanEditActivePeriode: {
    type: Boolean,
    default: false
  },
  
  isActive: {
    type: Boolean,
    default: false
  },

  owner: {
    type: Object as PropType<UserDto>,
    required: false,
  },
  
  myRole: {
    type: String,
    required: false,
  
  }
})

const range = defineModel<RangeDatePickerModel>('range',{ required: true });
const title = defineModel<String>('title',{required: true})

const ownerImageUrl = computed(() => props.owner?.imageId !== undefined
    ? `${BASE_URL}/api/file/${props.owner.imageId}`
    : undefined,
);

const emit = defineEmits<{ (e: "update:title", value: string): void }>();



const isFocused = ref(false);

</script>

<template>
    <template v-if="!loading">
        <header class="flex items-end gap-4">
            <template v-if="props.onClickPictureModal && props.userCanUpdateHeader">
                <div class="rounded-lg  transition hover:bg-gray-400/20" @click="props.onClickPictureModal">
                    <UAvatar :src="imageUrl" icon="i-heroicons-photo" size="3xl" />
                </div>
            </template>
            <template v-else>
                <UAvatar :src="imageUrl" icon="i-heroicons-photo" size="3xl" />
            </template>
            <UInput
                v-model="title" :disabled="!props.userCanEditActivePeriode" :rows="1" placeholder="Untitled"
                autoresize :variant="isFocused ? 'outline' : 'none'" class="mb-1 w-full font-extrabold transition"
                :class="{ 'hover:bg-gray-200 dark:hover:bg-gray-600': props.userCanUpdateHeader }" size="xl" :ui="{
                    size: { xl: 'text-4xl tracking-wide' },
                    padding: { xl: 'px-2 py-1' },
                    base: 'disabled:cursor-not-allowed disabled:opacity-100 ',
                }" @focus="isFocused = true" @blur="isFocused = false"
            />
        </header>
        <UDivider />
        <UCard class="mt-2">
            <section class="grid w-full grid-cols-[200px_1fr] gap-4 px-2">
                <div class="flex w-full items-center justify-between text-base font-medium opacity-80">
                    <span>Project Status</span>
                    <span>:</span>
                </div>
                <div class="flex w-full items-center">
                    <UBadge :color="props.isActive ? 'green' : 'red'" variant="subtle">
                        {{ props.isActive ? 'Active' : 'Inactive' }}
                    </UBadge>
                </div>

                <div class="flex w-full items-center justify-between text-base font-medium opacity-80">
                    <span>Project Manager</span>
                    <span>:</span>
                </div>
                <div class="flex w-full items-center gap-2">
                    <template v-if="props.owner === undefined">
                        <USkeleton class="h-8 w-full max-w-96 rounded-md" />
                    </template>
                    <template v-else>
                        <UAvatar :src="ownerImageUrl" :alt="props.owner.fullName.toString()" size="xs" />
                        <span class="text-sm">{{ props.owner.fullName }}</span>
                    </template>
                </div>

                <div class="flex w-full items-center justify-between text-base font-medium opacity-80">
                    <span>Active Period</span>
                    <span>:</span>
                </div>
                <div class="flex w-full items-center">
                    <RangeDatePicker
                        v-model="range" variant="solid"
                        :disabled="!props.userCanEditActivePeriode " color="white"
                    />
                </div>

                <div class="flex w-full items-center justify-between text-base font-medium opacity-80">
                    <span>My Role</span>
                    <span>:</span>
                </div>
                <div class="flex w-full items-center">
                    <span class="text-sm">{{ props.myRole }}</span>
                </div>
            </section>
        </UCard>
    </template>
    <template v-else>
        <header class="flex items-end gap-4">
            <USkeleton class="size-20 shrink-0 rounded-full" />
            <USkeleton class="h-11 w-full rounded-lg" />
        </header>
        <UDivider />
        <USkeleton class="mt-2 h-44 w-full rounded-lg" />
    </template>
</template>
