<script lang="ts" setup>
import SettingSection from '../-layout/section.vue';

const app = useAppStore();
const isPasswordModalOpen = inject(KEY.USER_CANGE_PASSWORD_MODAL_ISOPEN) as Ref<boolean>;
const isDeleteModalOpen = inject(KEY.DELETE_ACCOUNT_MODAL_ISOPEN) as Ref<boolean>;
const isLogoutModalOpen = inject(KEY.USER_LOGOUT_MODAL_ISOPEN) as Ref<boolean>;
</script>

<template>
    <SettingSection>
        <template #header>
            General
        </template>

        <template #body>
            <div
                class="grid w-full grid-cols-2 items-center justify-items-start gap-8"
            >
                <div
                    class="flex flex-col items-start justify-start gap-1"
                >
                    <label class="text-base font-semibold">
                        Dark Mode
                    </label>
                    <span class="text-xs">
                        Toggle darkmode appereance.
                    </span>
                </div>
                <div class="flex size-full items-end justify-end">
                    <UToggle v-model="app.isDark" />
                </div>

                <div
                    class="flex flex-col items-start justify-start gap-1"
                >
                    <label class="text-base font-semibold">
                        Password
                    </label>
                    <span class="text-xs">
                        Change account password
                    </span>
                </div>
                <div class="flex size-full items-end justify-end">
                    <UButton
                        label="Change"
                        variant="outline"
                        size="sm"
                        @click="isPasswordModalOpen = true"
                    />
                </div>

                <div
                    class="flex w-full flex-col items-start justify-start gap-1"
                >
                    <label class="text-base font-semibold">
                        Logout
                    </label>
                    <span class="text-xs">
                        Logout from all devices
                    </span>
                </div>
                <div class="flex size-full items-end justify-end">
                    <UButton
                        label="Logout"
                        icon="i-heroicons-arrow-left-on-rectangle"
                        variant="soft"
                        size="sm"
                        @click="isLogoutModalOpen = true"
                    />
                </div>

                <div
                    class="flex w-full flex-col items-start justify-start gap-1"
                >
                    <label class="text-base font-semibold text-red-500">
                        Delete
                    </label>
                    <span class="text-xs text-red-500">
                        Delete account premanently.
                    </span>
                </div>
                <div class="flex size-full items-end justify-end">
                    <UButton
                        label="Delete"
                        icon="i-heroicons-trash"
                        variant="soft"
                        color="red"
                        @click="isDeleteModalOpen = true"
                    />
                </div>
            </div>
        </template>
    </SettingSection>
</template>
