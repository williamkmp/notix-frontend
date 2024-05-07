<script setup lang="ts">
const isLogoutModalOpen = inject(KEY.USER_LOGOUT_MODAL_ISOPEN) as Ref<boolean>;
const auth = useAuth();
const notif = useNotification();

async function doLogoutAction() {
    auth.doClearAuth();
    notif.ok({ message: 'Please login using your account' });
    isLogoutModalOpen.value = false;
}
</script>

<template>
    <UModal v-model="isLogoutModalOpen">
        <UCard>
            <div class="mb-8">
                <p class="w-full text-center text-lg font-semibold">
                    Are you sure you want to logout?
                </p>
            </div>
            <div class="flex items-center justify-center gap-6">
                <div class="grow">
                    <UButton
                        label="Yes"
                        color="red"
                        variant="soft"
                        block
                        @click="doLogoutAction"
                    />
                </div>
                <div class="grow">
                    <UButton
                        label="No"
                        color="primary"
                        variant="soft"
                        block
                        @click="isLogoutModalOpen = false"
                    />
                </div>
            </div>
        </UCard>
    </UModal>
</template>
