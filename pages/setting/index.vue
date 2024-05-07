<script setup lang="ts">
import ChangePasswordModal from './-component/change-password-modal.vue';
import DeleteAccountModal from './-component/delete-account-modal.vue';
import ChangePictureModal from './-component/profile-picture-modal.vue';
import UserLogoutModal from './-component/user-logout-modal.vue';
import AccountSettingSection from './-component/account-setting-section.vue';
import GeneralSettingSection from './-component/general-setting-section.vue';
import AppPage from '~/layouts/-components/app-page.vue';

const isProfileModalOpen = ref(false);
const isLogoutModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isPasswordModalOpen = ref(false);

provide(KEY.PROFILE_PICTURE_MODAL_ISOPEN, isProfileModalOpen);
provide(KEY.USER_LOGOUT_MODAL_ISOPEN, isLogoutModalOpen);
provide(KEY.DELETE_ACCOUNT_MODAL_ISOPEN, isDeleteModalOpen);
provide(KEY.USER_CANGE_PASSWORD_MODAL_ISOPEN, isPasswordModalOpen);
</script>

<template>
    <AppPage>
        <template #left-header>
            <h1 class="text-base font-semibold">
                Setting
            </h1>
        </template>

        <template #body>
            <section class="size-full overflow-y-auto">
                <UContainer class="flex w-full flex-col items-center">
                    <div class="my-8 flex w-full flex-col items-center gap-10">
                        <AccountSettingSection />
                        <GeneralSettingSection />
                    </div>
                    <ChangePasswordModal />
                    <ChangePictureModal />
                    <UserLogoutModal />
                    <DeleteAccountModal />
                </UContainer>
            </section>
        </template>
    </AppPage>
</template>
