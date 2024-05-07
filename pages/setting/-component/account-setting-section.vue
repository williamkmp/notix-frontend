<script setup lang="ts">
import { z } from 'zod';
import SettingSection from '../-layout/section.vue';
import type { ServerData, UserDto } from '~/types';

// Dependencies
const isProfileModalOpen = inject(KEY.PROFILE_PICTURE_MODAL_ISOPEN) as Ref<boolean>;
const app = useAppStore();
const privateApi = usePrivateApi();
const { $v } = useMessage();
const notif = useNotification();

// States

// Actions
const profileForm = useFormDeclaration({
    initial: {
        email: app.user?.email,
        fullName: app.user?.fullName,
    },

    schema: z.object({
        email: z
            .string({
                required_error: $v('required'),
            })
            .max(100, $v('string_max:100'))
            .trim(),
        fullName: z
            .string({
                required_error: $v('required'),
            })
            .max(100, $v('string_max:100'))
            .trim(),
    }),

    onSubmit: async (form) => {
        const response: ServerData<UserDto> = await privateApi.put(
            '/api/user',
            {
                email: form.data.email,
                fullName: form.data.fullName,
                imageId: app.user!.imageId,
            },
        );
        app.user = response.data;
        notif.ok({ message: 'update_success' });
    },
});
</script>

<template>
    <SettingSection>
        <template #header>
            Account
        </template>

        <template #body>
            <UiForm
                :form="profileForm"
                class="grid w-full grid-cols-2 items-center justify-items-start gap-8"
            >
                <!-- Change Picture -->
                <UAvatar
                    :src="app.userImageUrl"
                    :alt="app.userFullName"
                    size="2xl"
                />
                <div class="flex size-full items-end justify-end">
                    <UButton
                        label="Change"
                        variant="outline"
                        @click="isProfileModalOpen = true"
                    />
                </div>

                <!-- User email field -->
                <div
                    class="flex size-full flex-col items-start justify-start gap-1"
                >
                    <label class="text-base font-semibold">
                        Email
                    </label>
                    <span class="text-xs">
                        Account's email address
                    </span>
                </div>
                <UFormGroup name="email" class="w-full">
                    <UInput
                        v-model="profileForm.state.email"
                        icon="i-heroicons-envelope"
                        :disabled="profileForm.isLoading.value"
                    />
                </UFormGroup>

                <!-- User name field -->
                <div
                    class="flex size-full flex-col items-start justify-start gap-1"
                >
                    <label class="text-base font-semibold">
                        Name
                    </label>
                    <span class="text-xs">
                        Account's display name
                    </span>
                </div>
                <UFormGroup name="fullName" class="w-full">
                    <UInput
                        v-model="profileForm.state.fullName"
                        :disabled="profileForm.isLoading.value"
                    />
                </UFormGroup>

                <!-- save btn -->
                <div class="col-span-full flex w-full justify-end">
                    <UButton
                        label="Save"
                        :loading="profileForm.isLoading.value"
                        type="submit"
                        size="sm"
                    />
                </div>
            </UiForm>
        </template>
    </SettingSection>
</template>
