<script lang="ts" setup>
import { z } from 'zod';
import type { LoginDto, ServerData } from '~/types';

definePageMeta({ layout: 'basic' });

// Dependency
const { $v } = useMessage();
const api = usePublicApi();
const app = useAppStore();

const loginForm = useFormDeclaration({
    initial: {
        email: 'william@email.com',
        password: 'password',
    },
    schema: z.object({
        email: z
            .string({ required_error: $v('required') })
            .min(1, $v('string_min:1'))
            .max(100, $v('string_min:100'))
            .email($v('string_email')),
        password: z
            .string({ required_error: $v('required') })
            .min(1, $v('string_min:1'))
            .max(100, $v('string_min:100')),
    }),
    onSubmit: async (form) => {
        const response: ServerData<LoginDto> = await api.post('/api/auth/login', {
            email: form.data.email,
            password: form.data.password,
        });
        app.user = response.data.user;
        app.accessToken = response.data.token.accessToken;
        app.refreshToken = response.data.token.refreshToken;
        await navigateTo('/');
    },
});
</script>

<template>
    <div class="flex flex-col gap-10">
        <header class="flex flex-col gap-4">
            <h1 class="text-5xl font-extrabold">
                Login
            </h1>
            <p class="text-sm">
                Hello, and welcome back.
            </p>
        </header>

        <UiForm :form="loginForm" class="flex w-80 flex-col gap-6">
            <UFormGroup label="Email" name="email">
                <UInput
                    v-model="loginForm.state.email" icon="i-heroicons-envelope" placeholder="user@email.com"
                    :disabled="loginForm.isLoading.value" size="md" autofocus
                />
            </UFormGroup>

            <UFormGroup label="Password" name="password">
                <UInput
                    v-model="loginForm.state.password" icon="i-heroicons-lock-closed" placeholder="password" size="md"
                    :disabled="loginForm.isLoading.value"
                />
            </UFormGroup>
        </UiForm>

        <div class="mt-5 flex w-full flex-col gap-4">
            <span class="w-full text-center text-sm text-red-500">
                {{ loginForm.error.value }}
            </span>
            <UButton :loading="loginForm.isLoading.value" block @click="loginForm.submit.value">
                Login
            </UButton>

            <UDivider label="or" />

            <span class="text-sm">
                Don't have an ccount? click <ULink class="text-primary-500 underline" to="/register">here</ULink> to register.
            </span>
        </div>
    </div>
</template>
