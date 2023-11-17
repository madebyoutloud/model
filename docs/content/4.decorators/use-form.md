---
title: useForm
---

[Composables]{.text-primary.font-semibold}

# useForm

useForm is used to provide form data, validate it and handle the submission.

All values and validation defined using the composable is automatically provided to inputs and can be injected using `valueKey` prop, which defines path to value in `values` object.

## Usage
```vue
<script lang="ts" setup>
import { useForm } from '@outloud/vue'

const values = reactive({ name: '' })

const form = useForm({
  values,
  handler: async (payload) => fetch('form', { data: payload })
})
</script>
```

### Reactive
This composables provides reactive variant, which unwraps all refs.
```ts
import { $useForm } from '@outloud/vue'

const form = $useForm({ ... })
form.isLoading // instead of form.isLoading.value
```

## Demo

```vue
<script lang="ts" setup>
import { useForm } from '@outloud/vue'
import { required, email } from '@vuelidate/validators'

// define reactive values
const values = reactive({
  firstName: '',
  lastName: '',
  email: '',
  isAgreed: false,
})

// define validation rules, which must be passed to submit the form
const rules = {
  firstName: { required },
  lastName: { required },
  email: { required, email },
  isAgreed: { agreed: (value: boolean) => value },
}

const form = $useForm({
  values,
  rules,
  handler: async (payload) => {
    // handler will be called when form is submitted and all validation rules passed
    await fetch('form', {
      data: payload
    })
  }
})
</script>

<template>
  <form @submit.prevent="form.submit()">
    <OInputControl valueKey="firstName" label="First Name">
      <OInput control />
    </OInputControl>

    <OInputControl valueKey="lastName" label="Last Name">
      <OInput control />
    </OInputControl>

    <OInputControl valueKey="email" label="Email">
      <OInput control />
    </OInputControl>

    <OSwitch valueKey="isAgreed" />

    <OButton
      type="submit"
      :loading="form.isLoading"
      :disabled="form.isSubmitted"
      label="Submit"
    />
  </form>
</template>
```

## Error handling
TODO

## Parameters
TODO

## Methods
TODO


## API
```ts
import { type InjectionKey, type Ref, type UnwrapNestedRefs } from 'vue';
import { type BaseValidation, type GlobalConfig, type ValidationArgs } from '@vuelidate/core';

export declare const UseFormKey: InjectionKey<UseForm>;

export type UseFormErrorHandler = (err: Error) => Record<string, any> | void;

export type UseFormValidationMode = 'submit' | 'change';

export interface UseFormOptions<State, Rules> {
    values: State;
    handler: <T>(values: State) => Promise<T | void> | T | void;
    minLoadingTime?: number;
    rules?: Ref<Rules> | Rules;
    validationOptions?: GlobalConfig;
    validationMode?: UseFormValidationMode;
}

type UseFormGetValueFn = (key: string, defaultValue?: any) => any;

type UseFormGetValidationFn = (key: string) => BaseValidation | undefined;

type UseFormSetValueFn = (key: string, value: any, markAsDirty?: boolean) => void;

export type UseForm = ReturnType<typeof useForm>;

export type UseFormReactive = UnwrapNestedRefs<UseForm>;

export declare const useFormConfig: import("../config").Config<{
    minLoadingTime: number;
    validationMode: UseFormValidationMode;
    errorHandler: UseFormErrorHandler | undefined;
}> & {
    minLoadingTime: number;
    validationMode: UseFormValidationMode;
    errorHandler: UseFormErrorHandler | undefined;
};

export declare const useForm: <T extends { [key in keyof Vargs]: any; }, Vargs extends ValidationArgs<unknown> = ValidationArgs<unknown>>
({ values, validationMode, ...options }: UseFormOptions<T, Vargs>) => {
    isLoading: Ref<boolean>;
    isValidated: Ref<boolean>;
    isSubmitted: Ref<boolean>;
    values: T;
    v$: Ref<import("@vuelidate/core").Validation<Vargs, Vargs>> | null;
    validationMode: UseFormValidationMode;
    getValue: UseFormGetValueFn;
    setValue: UseFormSetValueFn;
    mergeValues: (mergeValues: Record<string, any>) => void;
    getValidation: UseFormGetValidationFn;
    submit: () => Promise<any>;
};

export declare const $useForm: <T extends { [key in keyof Vargs]: any; }, Vargs extends ValidationArgs<unknown>= ValidationArgs<unknown>>
(options: UseFormOptions<T, Vargs>) => {
    isLoading: boolean;
    isValidated: boolean;
    isSubmitted: boolean;
    values: import("vue").UnwrapRef<T>;
    v$: import("@vuelidate/core").Validation<Vargs, Vargs> | null;
    validationMode: UseFormValidationMode;
    getValue: UseFormGetValueFn;
    setValue: UseFormSetValueFn;
    mergeValues: (mergeValues: Record<string, any>) => void;
    getValidation: UseFormGetValidationFn;
    submit: () => Promise<any>;
}
```