<script setup lang="ts">
const isDeleteModalOpen = inject(KEY.DELETE_ACCOUNT_MODAL_ISOPEN) as Ref<boolean>;
const auth = useAuth();
const notif = useNotification();

async function doDeleteAcoount() {
    auth.doClearAuth();
    notif.ok({ message: 'Logout success' });
    isDeleteModalOpen.value = false;
}
</script>

<template>
    <UModal v-model="isDeleteModalOpen">
        <UCard>
            <div class="mb-8">
                <p class="w-full text-center text-lg font-semibold">
                    Are you sure you want to permanently delete your account?
                </p>
            </div>
            <div class="flex items-center justify-center gap-6">
                <div class="grow">
                    <UButton
                        label="Yes"
                        color="red"
                        variant="soft"
                        block
                        @click="doDeleteAcoount"
                    />
                </div>
                <div class="grow">
                    <UButton
                        label="No"
                        color="primary"
                        variant="soft"
                        block
                        @click="isDeleteModalOpen = false"
                    />
                </div>
            </div>
        </UCard>
    </UModal>
</template>
