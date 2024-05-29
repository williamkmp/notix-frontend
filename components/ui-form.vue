<script setup lang="ts">
const props = defineProps<{
    form: any;
}>();
onMounted(() => {
    // eslint-disable-next-line vue/no-mutating-props
    props.form.submit.value = () => {
        props.form.ref.value?.submit();
    };
});
</script>

<template>
    <UForm
        :ref="props.form.ref" :state="props.form.state" :schema="props.form.schema" :validate-on="['submit']"
        @submit="props.form.submitEvent"
    >
        <slot />
    </UForm>
</template>
