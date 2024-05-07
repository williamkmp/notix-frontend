<script setup lang="ts">
import { z } from 'zod';

// Dependencies
const { $v } = useMessage();
const api = usePrivateApi();
const isPasswordModalOpen = inject(KEY.USER_CANGE_PASSWORD_MODAL_ISOPEN) as Ref<boolean>;

// Actions

const passwordForm = useFormDeclaration({
    schema: z.object({
        oldPassword: z
            .string({ required_error: $v('required') })
            .max(100, $v('string_max:100'))
            .trim(),
        newPassword: z
            .string({ required_error: $v('required') })
            .max(100, $v('string_max:100'))
            .trim(),
    }),
    onSubmit: async (form) => {
        await api.put(
            '/api/auth/change_password',
            {
                oldPassword: form.data.oldPassword,
                newPassword: form.data.newPassword,
            },
        );
        isPasswordModalOpen.value = false;
    },
});
watch(isPasswordModalOpen, passwordForm.reset);
</script>

<template>
    <UModal
        v-model="isPasswordModalOpen"
        :prevent-close="passwordForm.isLoading.value"
        @close="isPasswordModalOpen = false"
    >
        <UCard>
            <!-- header -->
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-bold">
                        Password
                    </h3>
                    <UButton
                        variant="ghost"
                        icon="i-heroicons-x-mark-20-solid"
                        :padded="false"
                        :disabled="passwordForm.isLoading.value"
                        @click="isPasswordModalOpen = false"
                    />
                </div>
            </template>

            <!-- body -->
            <template #default>
                <UiForm
                    :form="passwordForm"
                    class="flex w-full flex-col items-center justify-center gap-6"
                >
                    <UFormGroup
                        class="w-full"
                        label="Current Password"
                        name="oldPassword"
                    >
                        <UInput
                            v-model="passwordForm.state.oldPassword"
                            :disabled="passwordForm.isLoading.value"
                            placeholder="*****"
                            icon="i-heroicons-lock-closed"
                            type="password"
                            autofocus
                        />
                    </UFormGroup>

                    <UFormGroup
                        class="w-full"
                        label="New Password"
                        name="newPassword"
                    >
                        <UInput
                            v-model="passwordForm.state.newPassword"
                            :disabled="passwordForm.isLoading.value"
                            placeholder="*****"
                            type="password"
                            icon="i-heroicons-lock-closed"
                        />
                    </UFormGroup>

                    <UButton
                        label="Save"
                        class="mt-6"
                        :loading="passwordForm.isLoading.value"
                        type="submit"
                        block
                    />
                </UiForm>
            </template>
        </UCard>
    </UModal>
</template>
