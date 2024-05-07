import type { FormError } from '#ui/types';

export type FormState = ReturnType<typeof useFormDeclaration>;

export interface UForm {
    submit: () => Promise<void>;
    validate: (path?: string | string[]) => Promise<void>;
    clear: (path: string) => void;
    getErrors: (path?: string) => FormError[];
    setErrors: (errors: FormError[], path?: string) => void;
    error: Ref<FormError[]>;
}
