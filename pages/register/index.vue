<script lang="ts" setup>
import { z } from 'zod';
import type { LoginDto, ServerData } from '~/types';

definePageMeta({ layout: 'basic' });

// Dependency
const { $v } = useMessage();
const api = usePublicApi();
const app = useAppStore();

const loginForm = useFormDeclaration({
    schema: z.object({
        email: z
            .string({ required_error: $v('required') })
            .min(1, $v('string_min:1'))
            .max(255, $v('string_min:255'))
            .email($v('string_email')),
        fullName: z
            .string({ required_error: $v('required') })
            .min(1, $v('string_min:1'))
            .max(255, $v('string_min:255')),
        password: z
            .string({ required_error: $v('required') })
            .min(1, $v('string_min:1'))
            .max(255, $v('string_min:255')),
    }),
    onSubmit: async (form) => {
        const response: ServerData<LoginDto> = await api.post('/api/auth/register', {
            email: form.data.email,
            fullName: form.data.fullName,
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
        <header class="flex flex-col gap-6">
            <h1 class="text-5xl font-extrabold">
                Sign Up.
            </h1>
            <p class="text-sm">
                Create an ccount to start using the application.
            </p>
        </header>

        <UiForm :form="loginForm" class="flex w-80 flex-col gap-6">
            <UFormGroup label="Full Name" name="fullName">
                <UInput
                    v-model="loginForm.state.fullName" icon="i-heroicons-user" placeholder="John Doe"
                    :disabled="loginForm.isLoading.value" size="md" autofocus
                />
            </UFormGroup>

            <UFormGroup label="Email" name="email">
                <UInput
                    v-model="loginForm.state.email" icon="i-heroicons-envelope" placeholder="john@email.com"
                    :disabled="loginForm.isLoading.value" size="md"
                />
            </UFormGroup>

            <UFormGroup label="Password" name="password">
                <UInput
                    v-model="loginForm.state.password" icon="i-heroicons-lock-closed" placeholder="password" size="md"
                    :disabled="loginForm.isLoading.value"
                />
            </UFormGroup>
        </UiForm>

        <div class="mt-3 flex w-full flex-col gap-4">
            <span class="w-full text-center text-sm text-red-500">
                {{ loginForm.error.value }}
            </span>
            <UButton :loading="loginForm.isLoading.value" block @click="loginForm.submit.value">
                Register
            </UButton>

            <UDivider label="or" />

            <span class="text-sm">
                Already have an ccount? click <ULink class="text-primary-500 underline" to="/login">here</ULink> to login.
            </span>
        </div>
    </div>
</template>
